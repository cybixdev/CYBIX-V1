const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.pornimg|\/pornimg)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.lustdb.net/random/image');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Porn Image' });
      } else {
        await sendBanner(ctx, '🚫 No porn image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch porn image.');
    }
  });
};