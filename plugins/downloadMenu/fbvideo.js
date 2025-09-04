const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.fbvideo|\/fbvideo)\s+(.+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    if (!/^https?:\/\/(www\.)?facebook\.com\//.test(q)) {
      await sendBanner(ctx, '❗ Usage: .fbvideo <facebook video url>');
      return;
    }
    try {
      const res = await axios.get(`https://api.lolhuman.xyz/api/facebook?apikey=demo&url=${encodeURIComponent(q)}`);
      if (res.data && res.data.result && res.data.result.link) {
        await ctx.replyWithVideo({ url: res.data.result.link }, { caption: '📹 Facebook Video' });
      } else {
        await sendBanner(ctx, '🚫 No Facebook video found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Facebook video.');
    }
  });
};