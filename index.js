const { Telegraf, Markup } = require('telegraf');
const config = require('./config');
const express = require('express');
const pkg = require('./package.json');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Bot instance
if (!config.botToken) throw new Error('Telegram bot token is missing in config.js');
const bot = new Telegraf(config.botToken);

// Channel buttons for menu
const channelButtons = Markup.inlineKeyboard([
  [Markup.button.url('🌐 Whatsapp Channel', config.whatsappChannel || 'https://whatsapp.com')],
  [Markup.button.url('📣 Telegram Channel', config.telegramChannel || 'https://t.me')]
]);

// Plugin loader (counts plugins)
function loadPlugins(bot, sendBanner, config, baseDir = path.join(__dirname, 'plugins')) {
  let pluginCount = 0;
  if (fs.existsSync(baseDir)) {
    function walk(dir) {
      fs.readdirSync(dir).forEach(file => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
          walk(full);
        } else if (file.endsWith('.js')) {
          try {
            require(full)(bot, sendBanner, config);
            pluginCount++;
          } catch (e) {
            console.error(`Failed to load plugin: ${full}`, e);
          }
        }
      });
    }
    walk(baseDir);
  }
  return pluginCount;
}
const pluginCount = loadPlugins(bot, null, config);

// Menu function: sends banner first (no buttons), then menu (with channel buttons)
async function sendMenu(ctx) {
  try {
    // 1. Send banner (no caption, no buttons)
    await ctx.replyWithPhoto(
      { url: config.bannerUrl || 'https://i.postimg.cc/L4NwW5WY/boykaxd.jpg' }
    );

    // 2. Build menu text
    const now = new Date();
    const harareTime = now.toLocaleTimeString('en-US', { timeZone: config.timeZone || 'Africa/Harare' });
    const harareDate = now.toLocaleDateString('en-US', { timeZone: config.timeZone || 'Africa/Harare' });
    const uptime = `${process.uptime().toFixed(0)}s`;
    const ram = `${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    const userId = ctx?.from?.id || 'Unknown';
    const userName = ctx?.from?.first_name || 'User';
    const version = pkg.version;

    const menu = `
╭━━〔 CYBIX-V1 MENU 〕━━╮
│ ✦ Prefix : [ . ] or [ / ]
│ ✦ Owner : ${config.ownerId || 'Unknown'}
│ ✦ User : ${userName} (${userId})
│ ✦ Plugins Loaded : ${pluginCount}
│ ✦ Version : ${version}
│ ✦ Uptime : ${uptime}
│ ✦ Time Now : ${harareTime}
│ ✦ Date Today : ${harareDate}
│ ✦ Time Zone : Africa/Harare
│ ✦ Server RAM : ${ram}
╰───────────────────╯

╭━✦❮ AI MENU ❯✦━⊷
┃ chatgpt
┃ gemini
┃ llama
┃ imggen
┃ blackbox
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ DL MENU ❯✦━⊷
┃ apk
┃ song
┃ image
┃ play
┃ yts
┃ ytmp4
┃ gitclone
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ NSFW MENU ❯✦━⊷
┃ nsfw
┃ lewd
┃ xvideos
┃ xhamster
┃ rule34
┃ boobs
┃ ass
┃ hentaiimg
┃ nsfwgif
┃ ecchi
┃ yandere
┃ oppai
┃ feet
┃ cum
┃ peeing
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ HENTAI MENU ❯✦━⊷
┃ hebati
┃ hentai
┃ doujin
┃ nekopoi
┃ waifu18
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ PORN MENU ❯✦━⊷
┃ porn
┃ sextube
┃ pornhub
┃ milf
┃ ebony
┃ lesbian
┃ gangbang
┃ gloryhole
┃ dp
┃ anal
┃ blowjob
┃ facial
┃ cumshot
┃ creampie
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ ADULT MENU ❯✦━⊷
┃ adult
┃ bdsm
┃ femdom
┃ japan18
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ DEVELOPER ❯✦━⊷
┃ devinfo
┃ broadcast
┃ killall
┃ stats
┃ restart
┃ update
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ USEFUL MENU ❯✦━⊷
┃ shorten
┃ weather
┃ news
┃ currency
┃ crypto
┃ translate
┃ qr
┃ uuid
╰━━━━━━━━━━━━━━━━━⊷

╭━✦❮ FUN MENU ❯✦━⊷
┃ waifu
┃ meme
┃ joke
┃ anime
┃ roast
┃ diss
╰━━━━━━━━━━━━━━━━━⊷
`;

    // 3. Send menu (with channel buttons)
    await ctx.reply(menu, {
      ...channelButtons,
      parse_mode: 'Markdown'
    });
  } catch (e) {
    console.error('Menu error:', e);
    await ctx.reply('❌ Error sending menu: ' + e.message);
  }
}

// Menu triggers
bot.start(sendMenu);
bot.command('menu', sendMenu);
bot.command('start', sendMenu);
bot.hears(/^\.(menu|start)$/i, sendMenu);
bot.hears(/^\/(menu|start)$/i, sendMenu);
bot.hears(/^menu$/i, sendMenu);
bot.hears(/^start$/i, sendMenu);

// Unknown command fallback: banner only (no buttons/caption), then info with buttons
bot.on('text', async ctx => {
  const cmd = ctx.message?.text?.trim();
  if (cmd && /^(\.|\/)?[a-zA-Z]+/.test(cmd)) {
    await ctx.replyWithPhoto(
      { url: config.bannerUrl || 'https://i.postimg.cc/L4NwW5WY/boykaxd.jpg' }
    );
    await ctx.reply(
      `❓ Unknown command. Type .menu or /menu or .start or /start to see all features.`,
      { ...channelButtons, parse_mode: 'Markdown' }
    );
  }
});

// Express keepalive for Render/Vercel
const PORT = process.env.PORT || config.port || 3000;
const app = express();
app.get('/', (req, res) => res.send('CYBIX-V1 Bot is running.'));
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// Start bot, handle errors gracefully
bot.launch()
  .then(() => {
    console.log('CYBIX-V1 is running!');
  })
  .catch(e => {
    console.error('Bot failed to launch:', e);
  });

// Graceful shutdown for Render/Vercel
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));