require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN || !OWNER_ID) {
  throw new Error('BOT_TOKEN and OWNER_ID must be set in .env');
}

const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 90_000 });

const BANNER_URL = 'https://files.catbox.moe/7dozqn.jpg';
const TG_CHANNEL = 'https://t.me/cybixtech';
const WA_CHANNEL = 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X';

const channelButtons = Markup.inlineKeyboard([
  [Markup.button.url('Telegram Channel', TG_CHANNEL), Markup.button.url('WhatsApp Channel', WA_CHANNEL)]
]);

let PREFIXES = ['.', '/'];

// Plugin loader (ready for plugin files)
const plugins = {};
function loadPlugins() {
  const pluginsPath = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginsPath)) return;
  for (const category of fs.readdirSync(pluginsPath)) {
    const categoryPath = path.join(pluginsPath, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      for (const file of fs.readdirSync(categoryPath)) {
        if (file.endsWith('.js')) {
          const pluginName = file.replace('.js', '').toLowerCase();
          try {
            plugins[pluginName] = require(path.join(categoryPath, file));
          } catch (e) {
            console.error(`[Plugin Loader] Failed to load ${pluginName}:`, e.message);
          }
        }
      }
    }
  }
}
loadPlugins();

function isCmd(text) {
  return PREFIXES.some(prefix => text.startsWith(prefix));
}
function getCmd(text) {
  for (const prefix of PREFIXES) {
    if (text.startsWith(prefix)) return text.slice(prefix.length).split(' ')[0].toLowerCase();
  }
  return null;
}
function getArgs(text) {
  for (const prefix of PREFIXES) {
    if (text.startsWith(prefix)) return text.slice(prefix.length).split(' ').slice(1).join(' ');
  }
  return '';
}

function getMenuText(ctx) {
  const user = ctx.from?.first_name || 'Unknown';
  const userId = ctx.from?.id || 'Unknown';
  const stats = {
    users: 999,
    speed: '0.1s',
    status: 'Online',
    version: 'v1.0.0',
    timeNow: new Date().toLocaleTimeString(),
    dateNow: new Date().toLocaleDateString(),
    memory: `${(process.memoryUsage().heapUsed/1024/1024).toFixed(2)} MB`,
    plugins: Object.keys(plugins).length
  };
  return `
╭━───〔 𝐂𝐘𝐁𝐈𝐗 𝐕1 〕───━━╮
│ ✦ ᴘʀᴇғɪx : ${PREFIXES.join(', ')}
│ ✦ ᴏᴡɴᴇʀ : ${OWNER_ID}
│ ✦ ᴜsᴇʀ : ${user}
│ ✦ ᴜsᴇʀ ɪᴅ : ${userId}
│ ✦ ᴜsᴇʀs : ${stats.users}
│ ✦ sᴘᴇᴇᴅ : ${stats.speed}
│ ✦ sᴛᴀᴛᴜs : ${stats.status}
│ ✦ ᴘʟᴜɢɪɴs : ${stats.plugins}
│ ✦ ᴠᴇʀsɪᴏɴ : ${stats.version}
│ ✦ ᴛɪᴍᴇ ɴᴏᴡ : ${stats.timeNow}
│ ✦ ᴅᴀᴛᴇ ɴᴏᴡ : ${stats.dateNow}
│ ✦ ᴍᴇᴍᴏʀʏ : ${stats.memory}
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
`.trim();
}

async function sendBannerResponse(ctx, text) {
  try {
    await ctx.replyWithPhoto(
      { url: BANNER_URL },
      {
        caption: text,
        parse_mode: 'Markdown',
        ...channelButtons
      }
    );
  } catch (e) {
    await ctx.reply(text, { ...channelButtons, parse_mode: 'Markdown' });
  }
}

// Menu triggers
bot.start(async ctx => {
  await sendBannerResponse(ctx, getMenuText(ctx));
});
bot.command('menu', async ctx => {
  await sendBannerResponse(ctx, getMenuText(ctx));
});
bot.hears(/^\.menu$/, async ctx => {
  await sendBannerResponse(ctx, getMenuText(ctx));
});

// Prefix change command: owner only
bot.hears(new RegExp(`^(${PREFIXES.join('|')})setprefix\\s+(.+)$`, 'i'), async ctx => {
  if (String(ctx.from.id) !== OWNER_ID) return;
  const args = ctx.message.text.split(' ').slice(1);
  PREFIXES = args[0].split(',');
  await sendBannerResponse(ctx, `✅ Prefix updated: ${PREFIXES.join(', ')}`);
});

// Plugin routing: responds to any plugin command
bot.on('text', async ctx => {
  const text = ctx.message.text;
  if (!isCmd(text)) return;
  const cmd = getCmd(text);
  const args = getArgs(text);

  if (plugins[cmd]) {
    try {
      await plugins[cmd].handler(ctx, args, { sendBannerResponse });
    } catch (e) {
      await sendBannerResponse(ctx, '❌ Error in plugin.');
    }
  }
});

// Keepalive for Render/Termux
bot.launch({ webhook: { port: PORT } });
console.log('CYBIX V1 Bot is running.');

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));