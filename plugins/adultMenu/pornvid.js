const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.pornvid|\/pornvid)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.lustdb.net/random/video');
      if (res.data && res.data.url) {
        await ctx.replyWithVideo({ url: res.data.url }, { caption: '🔞 Porn Video' });
      } else {
        await sendBanner(ctx, '🚫 No porn video found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch porn video.');
    }
  });
};