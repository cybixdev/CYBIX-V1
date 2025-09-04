const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.video|\/video)\s+(.+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://api.lolhuman.xyz/api/ytvideo?apikey=demo&url=${encodeURIComponent(q)}`);
      if (res.data && res.data.result && res.data.result.link) {
        await ctx.replyWithVideo({ url: res.data.result.link }, { caption: `🎬 Video` });
      } else {
        await sendBanner(ctx, '🚫 No video found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch video.');
    }
  });
};