const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('docdl', async (ctx) => {
    const q = ctx.message.text.replace(/^\.docdl\s*/, '').trim();
    if (!q) {
      await sendBanner(ctx, '❗ Usage: .docdl <document file url>');
      return;
    }
    try {
      // Accepts any downloadable document link
      await ctx.replyWithDocument({ url: q }, { caption: `📄 Downloaded document` });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch document.');
    }
  });
};