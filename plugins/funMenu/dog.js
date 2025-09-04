const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.dog|\/dog)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://dog.ceo/api/breeds/image/random');
      if (res.data && res.data.message) {
        await ctx.replyWithPhoto({ url: res.data.message }, { caption: "🐶 Dog" });
      } else {
        await sendBanner(ctx, '🚫 No dog found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch dog.');
    }
  });
};