require('dotenv').config();
const { Telegraf } = require('telegraf');
const { useMultiFileAuthState, fetchLatestBaileysVersion, makeWASocket, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs-extra');
const path = require('path');
const prettyMs = require('pretty-ms');

// ====== CONFIG ======
const BOT_VERSION = '1.0.0';
const PREFIX = '.';
const OWNER_ID = process.env.OWNER_ID;
const SESSION_PATH = process.env.SESSION_PATH || './sessions';
const BANNER_URL = 'https://files.catbox.moe/28cr7v.jpg';

// ====== SYSTEM HELPERS ======
function getUptime() {
  return prettyMs(process.uptime() * 1000);
}
function getMemory() {
  const used = process.memoryUsage();
  return `${(used.rss / 1024 / 1024).toFixed(2)} MB`;
}
function getNowTime() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}
function getNowDate() {
  return new Date().toLocaleDateString('en-US');
}
function getAllPluginCount() {
  try {
    const pluginsPath = path.join(__dirname, 'plugins');
    let count = 0;
    const walk = (dir) => {
      fs.readdirSync(dir).forEach(f => {
        const abs = path.join(dir, f);
        if (fs.statSync(abs).isDirectory()) walk(abs);
        else if (abs.endsWith('.js')) count++;
      });
    };
    walk(pluginsPath);
    return count;
  } catch {
    return 0;
  }
}
function menuText(user, speed) {
  return `
╭━───〔 𝐂𝐘𝐁𝐈𝐗 𝐕1 〕───━━╮
│ ✦ ᴘʀᴇғɪx : .
│ ✦ ᴜsᴇʀ : ${user}
│ ✦ sᴘᴇᴇᴅ : ${speed}
│ ✦ sᴛᴀᴛᴜs : online
│ ✦ ᴘʟᴜɢɪɴs : ${getAllPluginCount()}
│ ✦ ᴠᴇʀsɪᴏɴ : ${BOT_VERSION}
│ ✦ ᴛɪᴍᴇ ɴᴏᴡ : ${getNowTime()}
│ ✦ ᴅᴀᴛᴇ ɴᴏᴡ : ${getNowDate()}
│ ✦ ᴍᴇᴍᴏʀʏ : ${getMemory()}
╰───────────────────╯

╭━━【 𝐀𝐈 𝐌𝐄𝐍𝐔 】━━
┃ • .chatgpt <q>
┃ • .openai <q>
┃ • .blackbox <q>
┃ • .gemini <q>
┃ • .deepseek <q>
┃ • .text2img <prompt>
╰━━━━━━━━━━━━━━━
╭━━【 𝐅𝐔𝐍 𝐌𝐄𝐍𝐔 】━━
┃ • .joke
┃ • .meme
┃ • .waifu
┃ • .dare
┃ • .truth
╰━━━━━━━━━━━━━━━
╭━━【 𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔 】━━
┃ • .obfuscator <code>
┃ • .calc <expr>
┃ • .img2url <file>
┃ • .tinyurl <url>
┃ • .tempmail
┃ • .fancy <text>
╰━━━━━━━━━━━━━━━
╭━━【 𝐒𝐄𝐀𝐑𝐂𝐇 𝐌𝐄𝐍𝐔 】━━
┃ • .lyrics <song>
┃ • .spotify-s <query>
┃ • .yts <query>
┃ • .wallpaper <query>
┃ • .weather <loc>
┃ • .google <q>
╰━━━━━━━━━━━━━━━
╭━━【 𝐃𝐋 𝐌𝐄𝐍𝐔 】━━
┃ • .apk <package>
┃ • .spotify <link>
┃ • .gitclone <repo>
┃ • .mediafire <url>
┃ • .play <url>
┃ • .ytmp4 <url>
┃ • .gdrive <link>
┃ • .docdl <url>
╰━━━━━━━━━━━━━━━
╭━━【 𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔 】━━
┃ • .repo
┃ • .ping
┃ • .runtime
┃ • .developer
┃ • .buybot
╰━━━━━━━━━━━━━━━
╭━━【 𝐀𝐃𝐔𝐋𝐓 𝐌𝐄𝐍𝐔 】━━
┃ • .xvideosearch <q>
┃ • .xnxxsearch <q>
┃ • .dl-xnxx <url>
┃ • .dl-xvideo <url>
╰━━━━━━━━━━━━━━━

ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐂𝐘𝐁𝐈𝐗 𝐃𝐄𝐕𝐒
`.trim();
}
function telegramPairMenu() {
  return `
╭━━【 CYBIX PAIR 】━━
┃ • /pair <number>
┃ • /delpair
┃ • /help
┃ • /owner
╰━━━━━━━━━━━━━━━
ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐂𝐘𝐁𝐈𝐗 𝐃𝐄𝐕𝐒
`.trim();
}

// ====== SESSION MGR ======
const waUsers = new Map();

// ====== TELEGRAM LOGIC ======
const telegram = new Telegraf(process.env.BOT_TOKEN);

telegram.start(async ctx => {
  await ctx.replyWithPhoto({ url: BANNER_URL }, { caption: telegramPairMenu() });
});
telegram.command('help', ctx => ctx.reply('Use /pair <your_number> to pair WhatsApp. For support, use /owner.'));
telegram.command('owner', ctx => ctx.reply('Owner: CYBIX DEVS'));
telegram.command('delpair', async ctx => {
  const userId = ctx.from.id;
  waUsers.delete(userId);
  await fs.remove(path.join(SESSION_PATH, String(userId)));
  ctx.reply('Session deleted!');
});
telegram.command('pair', async ctx => {
  const userId = ctx.from.id;
  const parts = ctx.message.text.split(' ');
  if (!parts[1]) return ctx.reply('Usage: /pair <number>');
  const waNumber = parts[1].replace(/[^0-9]/g, '');

  // ==== WA PAIRING ====
  const sessionDir = path.join(SESSION_PATH, String(userId));
  await fs.ensureDir(sessionDir);

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    printQRInTerminal: false,
    auth: state,
    browser: ['CYBIX', 'Chrome', BOT_VERSION]
  });

  sock.ev.on('creds.update', saveCreds);

  // Most reliable way to guarantee pairing: listen for QR and PairingCode and send both
  let pairingSent = false;
  sock.ev.on('connection.update', async update => {
    // Real-time pairing code event (for multi-device, WhatsApp cloud, or business beta)
    if (update.pairingCode && !pairingSent) {
      pairingSent = true;
      waUsers.set(userId, { sock, waNumber, sessionDir });
      await ctx.replyWithPhoto({ url: BANNER_URL }, {
        caption:
          `*Pairing code:* \`${update.pairingCode}\`\n\n1. Open WhatsApp\n2. Linked Devices > Link a Device\n3. Enter this code`
      });
    }
    // If WhatsApp provides QR code, fallback (old WhatsApp Web method)
    if (update.qr && !pairingSent) {
      pairingSent = true;
      waUsers.set(userId, { sock, waNumber, sessionDir });
      await ctx.replyWithPhoto({ url: BANNER_URL }, {
        caption:
          `*QR Code detected!*\n\nScan this QR code in WhatsApp:\n\n(You must run this bot on a server with a display/browser to show QR in console, or use the pairing code above if provided by WhatsApp)`
      });
      // Optionally, you can use a QR to image API to generate an image in Telegram.
      // But most users will see QR in terminal. (Baileys limitation)
    }
    if (update.connection === 'open') {
      await ctx.replyWithPhoto({ url: BANNER_URL }, { caption: '✅ WhatsApp paired!' });
    }
    if (update.connection === 'close') {
      if (update.lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
        waUsers.delete(userId);
        await fs.remove(sessionDir);
        await ctx.replyWithPhoto({ url: BANNER_URL }, { caption: '❌ WhatsApp session ended.' });
      }
    }
  });

  // WhatsApp command handler
  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || !msg.key.remoteJid) continue;
      const from = msg.key.remoteJid;
      const body = msg.message.conversation || '';
      if (!body.startsWith(PREFIX)) return;

      const [cmd, ...args] = body.slice(1).split(' ');
      const argstr = args.join(' ');
      const pushName = msg.pushName || waNumber;
      const speed = '50ms';

      // Plugins (to be implemented after)
      let pluginFound = false;
      const pluginGroups = [
        'aiMenu', 'funMenu', 'toolsMenu', 'searchMenu',
        'dlMenu', 'otherMenu', 'adultMenu'
      ];
      for (const group of pluginGroups) {
        const pluginFile = path.join(__dirname, 'plugins', group, `${cmd}.js`);
        if (fs.existsSync(pluginFile)) {
          try {
            pluginFound = true;
            const plugin = require(pluginFile);
            await plugin.run(sock, msg, argstr, () => BANNER_URL);
          } catch (e) {
            await sock.sendMessage(from, { image: { url: BANNER_URL }, caption: 'Error running command: ' + e.message });
          }
          break;
        }
      }
      if (pluginFound) continue;

      // Built-ins
      switch (cmd) {
        case 'ping':
          await sock.sendMessage(from, { image: { url: BANNER_URL }, caption: `Pong! Latency: ${speed}` });
          break;
        case 'menu': {
          await sock.sendMessage(from, {
            image: { url: BANNER_URL },
            caption: menuText(pushName, speed)
          });
          await sock.sendMessage(from, {
            image: { url: BANNER_URL },
            caption: "CYBIX TECH NEWSLETTER\n\n- Welcome to CYBIX V1! Stay tuned for updates.",
            contextInfo: { isForwarded: true }
          });
          break;
        }
        case 'runtime':
          await sock.sendMessage(from, { image: { url: BANNER_URL }, caption: `Uptime: ${getUptime()}` });
          break;
        case 'repo':
          await sock.sendMessage(from, { image: { url: BANNER_URL }, caption: 'https://github.com/CYBIXDEVS/cybix-v1-bot' });
          break;
        case 'developer':
          await sock.sendMessage(from, { image: { url: BANNER_URL }, caption: 'CYBIX DEVS' });
          break;
        default:
          await sock.sendMessage(from, { image: { url: BANNER_URL }, caption: 'Unknown command. Type .menu' });
      }
    }
  });
});

telegram.launch();
console.log('CYBIX V1 Telegram bot running!');

process.on('unhandledRejection', err => console.error('UNHANDLED', err));
process.on('uncaughtException', err => console.error('UNCAUGHT', err));