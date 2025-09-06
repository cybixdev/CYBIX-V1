require('dotenv').config();
const { Telegraf } = require('telegraf');
const { useMultiFileAuthState, fetchLatestBaileysVersion, makeWASocket, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const prettyMs = require('pretty-ms');

const telegram = new Telegraf(process.env.BOT_TOKEN);
const OWNER_ID = process.env.OWNER_ID;
const SESSION_PATH = process.env.SESSION_PATH || './sessions';
const BOT_VERSION = '1.0.0';
const PREFIX = '.';

const waUsers = new Map();

function getBannerBuffer() {
  const bannerPath = path.resolve(__dirname, 'assets/banner.jpg');
  if (fs.existsSync(bannerPath)) return fs.readFileSync(bannerPath);
  return null;
}

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
  const pluginsPath = path.join(__dirname, 'plugins');
  let count = 0;
  function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
      const abs = path.join(dir, f);
      if (fs.statSync(abs).isDirectory()) walk(abs);
      else if (abs.endsWith('.js')) count++;
    });
  }
  walk(pluginsPath);
  return count;
}

async function buildMenu(user, speed) {
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
┃ • .blackbox <code>
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
┃ • .play <song>
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
┃ • .dl-xnxxvid <url>
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

// === Telegram Side ===
telegram.start(async ctx => {
  if (getBannerBuffer()) {
    await ctx.replyWithPhoto({ source: getBannerBuffer() }, { caption: telegramPairMenu() });
  } else {
    await ctx.reply(telegramPairMenu());
  }
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
  ctx.reply('Generating WhatsApp pairing code...');

  // === WhatsApp Pairing ===
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

  sock.ev.on('connection.update', async update => {
    if (update.pairingCode) {
      waUsers.set(userId, { sock, waNumber, sessionDir });
      await ctx.replyWithMarkdown(`*Pairing code:* \`${update.pairingCode}\`\n\n1. Open WhatsApp\n2. Linked Devices > Link a Device\n3. Enter this code`);
    }
    if (update.connection === 'open') {
      await ctx.reply('✅ WhatsApp paired!');
    }
    if (update.connection === 'close') {
      if (update.lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
        waUsers.delete(userId);
        await fs.remove(sessionDir);
        await ctx.reply('❌ WhatsApp session ended.');
      }
    }
  });

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

      // Try to load plugin
      let pluginFound = false;
      // List of all plugin subfolders
      const pluginGroups = [
        'aiMenu', 'funMenu', 'toolsMenu', 'searchMenu', 'dlMenu', 'otherMenu', 'adultMenu'
      ];
      for (const group of pluginGroups) {
        const pluginFile = path.join(__dirname, 'plugins', group, `${cmd}.js`);
        if (fs.existsSync(pluginFile)) {
          try {
            pluginFound = true;
            const plugin = require(pluginFile);
            await plugin.run(sock, msg, argstr);
          } catch (e) {
            await sock.sendMessage(from, { text: 'Error running command: ' + e.message });
          }
          break;
        }
      }
      if (pluginFound) continue;

      // Built-in commands
      switch (cmd) {
        case 'ping':
          await sock.sendMessage(from, { text: `Pong! Latency: ${speed}` });
          break;
        case 'menu': {
          if (getBannerBuffer()) {
            await sock.sendMessage(from, { image: getBannerBuffer(), caption: await buildMenu(pushName, speed) });
          } else {
            await sock.sendMessage(from, { text: await buildMenu(pushName, speed) });
          }
          await sock.sendMessage(from, { text: "CYBIX TECH NEWSLETTER\n\n- Welcome to CYBIX V1! Stay tuned for updates.", contextInfo: { isForwarded: true } });
          break;
        }
        case 'runtime':
          await sock.sendMessage(from, { text: `Uptime: ${getUptime()}` });
          break;
        case 'repo':
          await sock.sendMessage(from, { text: 'https://github.com/JadenAfrix1' });
          break;
        case 'developer':
          await sock.sendMessage(from, { text: 'CYBIX DEVS' });
          break;
        default:
          await sock.sendMessage(from, { text: 'Unknown command. Type .menu' });
      }
    }
  });
});

telegram.launch();
console.log('CYBIX V1 Telegram bot running!');

process.on('unhandledRejection', err => console.error('UNHANDLED', err));
process.on('uncaughtException', err => console.error('UNCAUGHT', err));