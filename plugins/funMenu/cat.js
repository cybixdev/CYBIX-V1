const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.cat|\/cat)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.thecatapi.com/v1/images/search');
      if (res.data && res.data[0].url) {
        await ctx.replyWithPhoto({ url: res.data[0].url }, { caption: "🐱 Cat" });
      } else {
        await sendBanner(ctx, '🚫 No cat found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch cat.');
    }
  });
};