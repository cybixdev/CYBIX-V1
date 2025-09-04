const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.tiktokdl|\/tiktokdl)\s+(.+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    if (!/^https?:\/\/(www\.)?tiktok\.com\//.test(q)) {
      await sendBanner(ctx, '❗ Usage: .tiktokdl <tiktok video url>');
      return;
    }
    try {
      const res = await axios.get(`https://api.lolhuman.xyz/api/tiktok?apikey=demo&url=${encodeURIComponent(q)}`);
      if (res.data && res.data.result && res.data.result.link) {
        await ctx.replyWithVideo({ url: res.data.result.link });
      } else {
        await sendBanner(ctx, '🚫 No TikTok video found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch TikTok video.');
    }
  });
};