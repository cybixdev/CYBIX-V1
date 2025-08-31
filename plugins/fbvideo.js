const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('fbvideo', async ctx => {
    const url = ctx.message.text.replace(/\/fbvideo\s?/i, '').trim();
    if (!url || !url.startsWith('https://')) return ctx.reply('Usage: /fbvideo <facebook url>');
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/downloader/fbdown?url=${encodeURIComponent(url)}`);
      await sendBannerAndButtons(ctx, `📺 Facebook Video:\n${data.result?.url || "No video found."}`);
    } catch {
      await ctx.reply('❌ Failed to download Facebook video.');
    }
  });
};