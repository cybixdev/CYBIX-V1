const { Telegraf, Markup } = require('telegraf');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const express = require('express');
const pkg = require('./package.json');

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

// Load plugins (but never menu.js!)
// Plugins should only register commands, NOT execute anything.
function loadPlugins() {
  const pluginsDir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginsDir)) return;
  fs.readdirSync(pluginsDir).forEach(file => {
    const full = path.join(pluginsDir, file);
    if (fs.statSync(full).isDirectory()) {
      fs.readdirSync(full).forEach(sub => {
        if (sub.endsWith('.js')) require(path.join(full, sub))(bot, sendBanner, config);
      });
    } else if (file.endsWith('.js') && file !== 'menu.js') {
      require(full)(bot, sendBanner, config);
    }
  });
}
loadPlugins();

// Only call menu when ctx exists
const menuPlugin = require('./plugins/menu');
bot.start(ctx => menuPlugin(bot, sendBanner, config, ctx, pkg.version));
bot.command('menu', ctx => menuPlugin(bot, sendBanner, config, ctx, pkg.version));
bot.hears(/^\.(menu|start)/, ctx => menuPlugin(bot, sendBanner, config, ctx, pkg.version));

// Unknown command fallback
bot.on('text', async ctx => {
  const cmd = ctx.message.text.trim();
  if (cmd.startsWith('.') || cmd.startsWith('/')) {
    await sendBanner(ctx, `❓ Unknown command. Type .menu or /menu to see all features.`);
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