const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('twimg', async ctx => {
    const url = ctx.message.text.replace(/\/twimg\s?/i, '').trim();
    if (!url || !url.startsWith('https://')) return ctx.reply('Usage: /twimg <twitter url>');
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/downloader/twitterimage?url=${encodeURIComponent(url)}`);
      await sendBannerAndButtons(ctx, `🐦 Twitter Image:\n${data.result?.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to download Twitter image.');
    }
  });
};