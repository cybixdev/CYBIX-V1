require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const PORT = process.env.PORT || 3000;
if (!BOT_TOKEN || !OWNER_ID) throw new Error('BOT_TOKEN and OWNER_ID must be set in .env');

let prefix = ['.', '/'];
let botName = 'CYBIX V1';
let bannerUrl = 'https://files.catbox.moe/7dozqn.jpg';
let startTime = Date.now();
let users = new Set();
const usersFile = path.join(__dirname, 'users.json');

// Persistent users
function saveUsers() { try { fs.writeFileSync(usersFile, JSON.stringify([...users])); } catch {} }
function loadUsers() { if (fs.existsSync(usersFile)) { try { users = new Set(JSON.parse(fs.readFileSync(usersFile, 'utf8'))); } catch {} } }
loadUsers();

const buttons = Markup.inlineKeyboard([
  [Markup.button.url('Telegram Channel', 'https://t.me/cybixtech')],
  [Markup.button.url('WhatsApp Channel', 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X')]
]);

function uptimeStr(ms) {
  let s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

function menuCaption(ctx) {
  const user = ctx.from || {};
  const memory = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
  const speed = `${Math.floor(Math.random() * 100)}ms`;
  const plugins = fs.existsSync('./plugins') && fs.readdirSync('./plugins').reduce((acc, folder) => {
    const folderPath = path.join('./plugins', folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
      acc += fs.readdirSync(folderPath).filter(f => f.endsWith('.js')).length;
    }
    return acc;
  }, 0);
  const now = new Date();
  return `
╭━───〔 ${botName} 〕───━━╮
│ ✦ ᴘʀᴇғɪx : ${prefix.join(', ')}
│ ✦ ᴏᴡɴᴇʀ : ${OWNER_ID}
│ ✦ ᴜsᴇʀ : ${user.first_name || ''}
│ ✦ ᴜsᴇʀ ɪᴅ : ${user.id || ''}
│ ✦ ᴜsᴇʀs : ${users.size}
│ ✦ sᴘᴇᴇᴅ : ${speed}
│ ✦ sᴛᴀᴛᴜs : Online
│ ✦ ᴘʟᴜɢɪɴs : ${plugins}
│ ✦ ᴠᴇʀsɪᴏɴ : 1.0.0
│ ✦ ᴛɪᴍᴇ ɴᴏᴡ : ${now.toLocaleTimeString()}
│ ✦ ᴅᴀᴛᴇ ɴᴏᴡ : ${now.toLocaleDateString()}
│ ✦ ᴍᴇᴍᴏʀʏ : ${memory}
│ ✦ ʀᴜɴᴛɪᴍᴇ : ${uptimeStr(Date.now() - startTime)}
╰───────────────────╯
╭━━【 𝐀𝐈 𝐌𝐄𝐍𝐔 】━━
┃ • ᴄʜᴀᴛɢᴘᴛ
┃ • ᴏᴘᴇɴᴀɪ
┃ • ʙʟᴀᴄᴋʙᴏx
┃ • ɢᴇᴍɪɴɪ
┃ • ᴅᴇᴇᴘsᴇᴋ
┃ • ᴛᴇxᴛ2ɪᴍɢ
╰━━━━━━━━━━━━━━━
╭━━【 𝐅𝐔𝐍 𝐌𝐄𝐍𝐔 】━━
┃ • ᴊᴏᴋᴇ
┃ • ᴍᴇᴍᴇ
┃ • ᴡᴀɪғᴜ
┃ • ᴅᴀʀᴇ
┃ • ᴛʀᴜᴛʜ
╰━━━━━━━━━━━━━━━
╭━━【 𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔 】━━
┃ • ᴏʙғᴜsᴄᴀᴛᴏʀ
┃ • ᴄᴀʟᴄ
┃ • ɪᴍɢ2ᴜʀʟ
┃ • ᴛɪɴʏᴜʀʟ
┃ • ᴛᴇᴍᴘᴍᴀɪʟ
┃ • ғᴀɴᴄʏ
╰━━━━━━━━━━━━━━━
╭━━【 𝐒𝐄𝐀𝐑𝐂𝐇 𝐌𝐄𝐍𝐔 】━━
┃ • ʟʏʀɪᴄs
┃ • sᴘᴏᴛɪғʏ-s
┃ • ʏᴛs
┃ • ᴡᴀʟʟᴘᴀᴘᴇʀ
┃ • ᴡᴇᴀᴛʜᴇʀ
┃ • ɢᴏᴏɢʟᴇ
╰━━━━━━━━━━━━━━━
╭━━【 𝐃𝐋 𝐌𝐄𝐍𝐔 】━━
┃ • ᴀᴘᴋ
┃ • sᴘᴏᴛɪғʏ
┃ • ɢɪᴛᴄʟᴏɴᴇ
┃ • ᴍᴇᴅɪᴀғɪʀᴇ
┃ • ᴘʟᴀʏ
┃ • ʏᴛᴍᴘ4
┃ • ɢᴅʀɪᴠᴇ
┃ • ᴅᴏᴄᴅʟ 
╰━━━━━━━━━━━━━━━
╭━━【 𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔 】━━
┃ • ʀᴇᴘᴏ
┃ • ᴘɪɴɢ
┃ • ʀᴜɴᴛɪᴍᴇ
┃ • ᴅᴇᴠᴇʟᴏᴘᴇʀ
┃ • ʙᴜʏʙᴏᴛ
╰━━━━━━━━━━━━━━━
╭━━【 𝐀𝐃𝐔𝐋𝐓 𝐌𝐄𝐍𝐔 】━━
┃ • xᴠɪᴅᴇᴏsᴇᴀʀᴄʜ
┃ • xɴxxsᴇᴀʀᴄʜ
┃ • ᴅʟ-xɴxxᴠɪᴅ
┃ • ᴅʟ-xᴠɪᴅᴇᴏ
┃ • ʙᴏᴏʙs
┃ • ᴀss
┃ • ɴᴜᴅᴇs
╰━━━━━━━━━━━━━━━
╭━━【𝐃𝐄𝐕 𝐌𝐄𝐍𝐔】━━
┃ • sᴛᴀᴛɪᴄs
┃ • ʟɪsᴛᴜsᴇʀs
┃ • ᴍᴏᴅᴇ
┃ • ʟɪsᴛᴜsᴇʀs
┃ • ʟᴏɢs
┃ • ɪɴғᴏ
┃ • sᴇᴛʙᴀɴɴᴇʀ
┃ • sᴇᴛᴘʀᴇғɪx
┃ • sᴇᴛʙᴏᴛɴᴀᴍᴇ
╰━━━━━━━━━━━━━━━

ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐂𝐘𝐁𝐈𝐗 𝐃𝐄𝐕𝐒
`;
}

function sendBanner(ctx, caption) {
  return ctx.replyWithPhoto({ url: bannerUrl }, {
    caption,
    ...buttons,
    parse_mode: 'Markdown'
  });
}

function isCmd(text) { return prefix.some((p) => text.startsWith(p)); }
function getCmd(text) { return isCmd(text) ? text.slice(prefix.find(p => text.startsWith(p)).length).split(' ')[0].toLowerCase() : null; }
function isOwner(ctx) { return `${ctx.from.id}` === OWNER_ID; }

const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 99999 });

function addUser(ctx) {
  if (ctx.from && ctx.from.id) {
    users.add(ctx.from.id);
    saveUsers();
  }
}

// Dev commands
bot.command('statics', ctx => {
  addUser(ctx);
  let mem = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
  let up = uptimeStr(Date.now() - startTime);
  sendBanner(ctx, `Statics:\nVersion: 1.0.0\nMemory: ${mem}\nUptime: ${up}\nUsers: ${users.size}`);
});
bot.command('listusers', ctx => {
  addUser(ctx);
  sendBanner(ctx, `User IDs:\n${[...users].join('\n') || 'No users yet.'}`);
});
bot.command('mode', ctx => { addUser(ctx); sendBanner(ctx, 'Mode: Production'); });
bot.command('logs', ctx => { addUser(ctx); sendBanner(ctx, 'Logs: Feature not implemented.'); });
bot.command('info', ctx => { addUser(ctx); sendBanner(ctx, `Bot Name: ${botName}\nOwner: ${OWNER_ID}\nPrefix: ${prefix.join(', ')}\nVersion: 1.0.0`); });
bot.command('setbanner', ctx => {
  addUser(ctx);
  if (!isOwner(ctx)) return sendBanner(ctx, 'Owner only command.');
  let url = ctx.message.text.split(' ').slice(1).join(' ');
  if (!url) return sendBanner(ctx, 'Usage: /setbanner <image_url>');
  bannerUrl = url;
  sendBanner(ctx, `Banner changed to: ${bannerUrl}`);
});
bot.command(['setprefix', 'setPrefix'], ctx => {
  addUser(ctx);
  if (!isOwner(ctx)) return sendBanner(ctx, 'Owner only command.');
  const args = ctx.message.text.split(' ').slice(1);
  if (!args.length) return sendBanner(ctx, 'Usage: /setprefix <newPrefix> [<morePrefixes>]');
  prefix = args;
  sendBanner(ctx, `Prefix changed to: ${prefix.join(', ')}`);
});
bot.command('setbotname', ctx => {
  addUser(ctx);
  if (!isOwner(ctx)) return sendBanner(ctx, 'Owner only command.');
  let name = ctx.message.text.split(' ').slice(1).join(' ');
  if (!name) return sendBanner(ctx, 'Usage: /setbotname <newName>');
  botName = name;
  sendBanner(ctx, `Bot name changed to: ${botName}`);
});

// Menu (always sends full menu as photo+caption+buttons as one message)
const menuCommands = ['menu', 'start', 'bot'];
for (const cmd of menuCommands) {
  bot.command(cmd, ctx => { addUser(ctx); sendBanner(ctx, menuCaption(ctx)); });
  bot.hears([`.${cmd}`, `/${cmd}`], ctx => { addUser(ctx); sendBanner(ctx, menuCaption(ctx)); });
}

// Plugins handler
bot.on('text', async ctx => {
  addUser(ctx);
  const text = ctx.message.text;
  if (!isCmd(text)) return;
  const cmd = getCmd(text);
  let handled = false;
  const pluginsDir = path.join(__dirname, 'plugins');
  if (fs.existsSync(pluginsDir)) {
    for (const folder of fs.readdirSync(pluginsDir)) {
      const folderPath = path.join(pluginsDir, folder);
      if (fs.lstatSync(folderPath).isDirectory()) {
        for (const file of fs.readdirSync(folderPath)) {
          if (file.endsWith('.js')) {
            const plugin = require(path.join(folderPath, file));
            if (plugin && plugin.command === cmd && typeof plugin.handler === 'function') {
              await plugin.handler(ctx, sendBanner);
              handled = true;
              break;
            }
          }
        }
      }
      if (handled) break;
    }
  }
  if (!handled) await sendBanner(ctx, `Unknown command: ${cmd}\nUse .menu to see available commands.`);
});

bot.catch((err, ctx) => {
  sendBanner(ctx, 'An internal error occurred. Try again later.');
  console.error('Bot Error:', err);
});

bot.launch();
console.log('Bot running in polling mode (Render/Termux/Node.js)');
if (process.env.RENDER) require('http').createServer((_, res) => res.end(`${botName} Bot Running`)).listen(PORT);
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));