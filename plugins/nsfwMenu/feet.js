const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.feet|\/feet)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/feet');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Feet' });
      } else {
        await sendBanner(ctx, '🚫 No feet image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch feet.');
    }
  });
};