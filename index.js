const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const packageJson = require('./package.json');

// Global bot state
const users = new Set();
const startTime = Date.now();
let botName = 'CYBIX V1';
let bannerUrl = 'https://files.catbox.moe/7dozqn.jpg';
let prefix = ['.', '/'];

// Example buttons (customize as needed)
const buttons = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "Repo", url: "https://github.com/Ash-Lynx1/CYBIX-V1" }],
      [{ text: "Developer", url: "https://t.me/Ash_Lynx1" }]
    ]
  }
};

// Helper to add user to set
function addUser(ctx) {
  users.add(ctx.from.id);
}

// Helper to format uptime
function uptimeStr(ms) {
  let s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

// Menu caption generator (customize as needed)
function menuCaption(ctx) {
  // You can split this into sections if desired
  return `
╭━───〔 CYBIX V1 〕───━━╮
│ ✦ ᴘʀᴇғɪx : ${prefix.join(', ')}
│ ✦ ᴏᴡɴᴇʀ : ${process.env.OWNER_ID || ctx.from.id}
│ ✦ ᴜsᴇʀ : ${ctx.from.username || 'CYBIX DEV'}
│ ✦ ᴜsᴇʀ ɪᴅ : ${ctx.from.id}
│ ✦ ᴜsᴇʀs : ${users.size}
│ ✦ sᴘᴇᴇᴅ : ${Date.now() - ctx.message.date * 1000}ms
│ ✦ sᴛᴀᴛᴜs : Online
│ ✦ ᴘʟᴜɢɪɴs : 51
│ ✦ ᴠᴇʀsɪᴏɴ : ${packageJson.version}
│ ✦ ᴛɪᴍᴇ ɴᴏᴡ : ${new Date().toLocaleTimeString()}
│ ✦ ᴅᴀᴛᴇ ɴᴏᴡ : ${new Date().toLocaleDateString()}
│ ✦ ᴍᴇᴍᴏʀʏ : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
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
┃ • ᴅʟ-xᴠɪᴅᴇᴏᴠɪᴅᴇᴏ
┃ • ʙᴏᴏʙs
┃ • ᴀss
┃ • ɴᴜᴅᴇs
╰━━━━━━━━━━━━━━━

╭━━【 𝐃𝐄𝐕 𝐌𝐄𝐍𝐔 】━━
┃ • sᴛᴀᴛɪᴄs
┃ • ʟɪsᴛᴜsᴇʀs
┃ • ᴍᴏᴅᴇ
┃ • ʟᴏɢs
┃ • ɪɴғᴏ
┃ • sᴇᴛʙᴀɴɴᴇʀ
┃ • sᴇᴛᴘʀᴇғɪx
┃ • sᴇᴛʙᴏᴛɴᴀᴍᴇ
╰━━━━━━━━━━━━━━━
`;
}

// Revised sendBanner: sends banner image (short caption), then full menu
function sendBanner(ctx, caption) {
  // Send banner image with a short caption
  ctx.replyWithPhoto({ url: bannerUrl }, {
    caption: botName,
    ...buttons,
    parse_mode: 'Markdown'
  });
  // Then send the full menu as a text message
  ctx.reply(caption, { parse_mode: 'Markdown', ...buttons });
}

// Menu triggers: you can expand or customize these
const menuTriggers = [
  /^([./]|)(menu|help|start)$/i,
  /^([./]|)(cybix)$/i
];

// Register menu triggers
menuTriggers.forEach(trigger => {
  bot.hears(trigger, ctx => {
    addUser(ctx);
    sendBanner(ctx, menuCaption(ctx));
  });
  bot.command(trigger.toString().replace(/^[./]/, ''), ctx => {
    addUser(ctx);
    sendBanner(ctx, menuCaption(ctx));
  });
});

// Plugin loader (simple, loads all plugins in plugins/*Menu/*)
const fs = require('fs');
const path = require('path');
function loadPlugins() {
  const pluginDirs = fs.readdirSync(path.join(__dirname, 'plugins')).filter(f => f.endsWith('Menu'));
  for (const dir of pluginDirs) {
    const fullDir = path.join(__dirname, 'plugins', dir);
    fs.readdirSync(fullDir).forEach(file => {
      if (file.endsWith('.js')) {
        const plugin = require(path.join(fullDir, file));
        if (plugin.command && plugin.handler) {
          bot.command(plugin.command, async ctx => {
            addUser(ctx);
            await plugin.handler(ctx, sendBanner);
          });
          bot.hears(new RegExp(`^([./]|)${plugin.command}(\\s|$)`, 'i'), async ctx => {
            addUser(ctx);
            await plugin.handler(ctx, sendBanner);
          });
        }
      }
    });
  }
}

// Load all plugins
loadPlugins();

// Start bot polling
bot.launch();
console.log('Bot running in polling mode (Render/Termux/Node.js)');

// Export for plugins
module.exports = {
  bot,
  users,
  startTime,
  botName,
  bannerUrl,
  prefix,
  buttons
};