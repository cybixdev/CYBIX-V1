require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const config = require('./config');

global.users = new Set();
global.groups = new Set();

const bot = new Telegraf(process.env.BOT_TOKEN);

// --- Telegram Bot Menu ---
function sendMenu(ctx) {
  const menu =
`╭━━━━━━━【 CYBIX V1 】━━━━━━━
┃ @${ctx.from.username || ctx.from.first_name}
┣━ users: ${global.users.size}
┣━ groups: ${global.groups.size}
┣━ prefix: "."
┣━ owner: ${config.developer}
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━【 AI MENU 】━━
┃ • .chatgpt
┃ • .bard
┃ • .deepseek
┃ • .blackbox
┃ • .llama
╰━━━━━━━━━━━━━━━
╭━━【 DOWNLOAD 】━━
┃ • .apk
┃ • .play
┃ • .video
┃ • .gitclone
┃ • .insta
┃ • .tiktok
┃ • .pinterest
┃ • .image
┃ • .youtube_audio
┃ • .youtube_subs
╰━━━━━━━━━━━━━━━
╭━━【 FUN 】━━
┃ • .joke
┃ • .meme
┃ • .weather
┃ • .quote
┃ • .anime
┃ • .waifu
┃ • .cat
┃ • .dog
╰━━━━━━━━━━━━━━━
╭━━【 TOOLS 】━━
┃ • .ping
┃ • .runtime
┃ • .help
┃ • .info
┃ • .currency
┃ • .shorturl
┃ • .developer
┃ • .buybot
┃ • .repo
╰━━━━━━━━━━━━━━━
╭━━【 DEVELOPER 】━━
┃ • .broadcast
┃ • .statics
┃ • .mode
┃ • .listusers
┃ • .groupstat
╰━━━━━━━━━━━━━━━

▣ powered by *CYBIX TECH* 👹💀
`;

  return ctx.replyWithPhoto(
    { url: config.banner },
    {
      caption: menu,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(config.buttons)
    }
  );
}

// --- User & Group Tracking ---
bot.use((ctx, next) => {
  if (ctx.from && ctx.from.id) global.users.add(ctx.from.id);
  if (ctx.chat && (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup')) global.groups.add(ctx.chat.id);
  return next();
});

bot.start(sendMenu);
bot.command('menu', sendMenu);

// --- Dynamic Plugin Loader (supports nested folders) ---
function loadPlugins(bot, folder) {
  fs.readdirSync(folder).forEach(file => {
    const fullPath = path.join(folder, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      loadPlugins(bot, fullPath);
    } else if (file.endsWith('.js')) {
      const plugin = require(fullPath);
      bot.hears(plugin.pattern, async ctx => {
        try {
          await plugin.handler(ctx, bot);
        } catch (e) {
          await ctx.reply('❌ Error: ' + (e.message || "Unknown error"));
        }
      });
    }
  });
}
loadPlugins(bot, path.join(__dirname, 'plugins'));

// --- Broadcast for owner only ---
bot.hears(/^\.broadcast (.+)/, async ctx => {
  if (String(ctx.from.id) !== process.env.OWNER_ID) return;
  const msg = ctx.match[1];
  for (const id of global.users) {
    try {
      await bot.telegram.sendPhoto(
        id,
        { url: config.banner },
        {
          caption: `📢 Broadcast:\n${msg}`,
          ...Markup.inlineKeyboard(config.buttons)
        }
      );
    } catch {}
  }
  for (const gid of global.groups) {
    try {
      await bot.telegram.sendPhoto(
        gid,
        { url: config.banner },
        {
          caption: `📢 Broadcast:\n${msg}`,
          ...Markup.inlineKeyboard(config.buttons)
        }
      );
    } catch {}
  }
  await ctx.reply('✅ Broadcast sent!');
});

// --- Group/channel support ---
bot.on('new_chat_members', ctx => sendMenu(ctx));
bot.on('group_chat_created', ctx => sendMenu(ctx));
bot.on('channel_post', ctx => sendMenu(ctx));

// --- Render Port Compatibility (optional for health check, but not required) ---
if (process.env.PORT) {
  // Start a minimal HTTP server for Render port binding
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('CYBIX V1 Telegram Bot is running!\n');
  });
  server.listen(process.env.PORT, () => {
    console.log(`HTTP health-check server listening on port ${process.env.PORT}`);
    bot.launch().then(() => console.log("CYBIX V1 Telegram Bot started!"));
  });
} else {
  bot.launch().then(() => console.log("CYBIX V1 Telegram Bot started!"));
}

// --- Graceful Shutdown ---
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
