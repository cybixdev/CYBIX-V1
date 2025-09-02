const { Telegraf, Markup } = require('telegraf');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const express = require('express');
const pkg = require('./package.json');

// Plugin loader - returns plugin count for menu
function loadPlugins(bot, sendBanner, config) {
  const pluginsDir = path.join(__dirname, 'plugins');
  let pluginCount = 0;
  if (!fs.existsSync(pluginsDir)) return pluginCount;
  fs.readdirSync(pluginsDir).forEach(file => {
    const full = path.join(pluginsDir, file);
    if (fs.statSync(full).isDirectory()) {
      fs.readdirSync(full).forEach(sub => {
        if (sub.endsWith('.js')) {
          require(path.join(full, sub))(bot, sendBanner, config);
          pluginCount++;
        }
      });
    } else if (file.endsWith('.js') && file !== 'menu.js') {
      require(full)(bot, sendBanner, config);
      pluginCount++;
    }
  });
  return pluginCount;
}

const bot = new Telegraf(config.botToken);

const channelButtons = Markup.inlineKeyboard([
  [Markup.button.url('🌐 Whatsapp Channel', config.whatsappChannel)],
  [Markup.button.url('📣 Telegram Channel', config.telegramChannel)]
]);

const sendBanner = async (ctx, message, extra = {}) => {
  if (!ctx || !ctx.replyWithPhoto) return;
  await ctx.replyWithPhoto(
    { url: config.bannerUrl },
    {
      caption: message,
      ...extra,
      ...channelButtons,
      parse_mode: 'Markdown'
    }
  );
};

const loadedPlugins = loadPlugins(bot, sendBanner, config);

// Always respond to /menu, .menu, /start, .start, menu, start
const menuPlugin = require('./plugins/menu');
const menuHandler = ctx => menuPlugin({
  bot,
  sendBanner,
  config,
  ctx,
  version: pkg.version,
  pluginCount: loadedPlugins
});

bot.start(menuHandler);
bot.command('menu', menuHandler);
bot.command('start', menuHandler);
bot.hears(/^(\.|\/)?(menu|start)$/i, menuHandler);

// Fallback for unknown commands
bot.on('text', async ctx => {
  const cmd = ctx.message.text.trim();
  if (/^(\.|\/)?[a-zA-Z]+/.test(cmd)) {
    await sendBanner(ctx, `❓ Unknown command. Type .menu or /menu or .start or /start to see all features.`);
  }
});

// Express keepalive for Render/Vercel
if (process.env.PORT) {
  const app = express();
  app.get('/', (req, res) => res.send('CYBIX-V1 Bot is running.'));
  app.listen(config.port, () => {
    console.log(`Express server running on port ${config.port}`);
  });
}

bot.launch().then(() => {
  console.log('CYBIX-V1 is running!');
});