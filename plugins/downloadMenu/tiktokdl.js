const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('tiktokdl', async (ctx) => {
    const q = ctx.message.text.replace(/^\.tiktokdl\s*/, '').trim();
    if (!q || !/^https?:\/\/(www\.)?tiktok\.com\//.test(q)) {
      await sendBanner(ctx, '❗ Usage: .tiktokdl <tiktok video url>');
      return;
    }
    try {
      const res = await axios.get(`https://api.akuari.my.id/downloader/tiktok?link=${encodeURIComponent(q)}`);
      if (res.data && res.data.result && res.data.result.video) {
        await ctx.replyWithVideo({ url: res.data.result.video });
      } else {
        await sendBanner(ctx, '🚫 No TikTok video found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch TikTok video.');
    }
  });
};