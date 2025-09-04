const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.fox|\/fox)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://randomfox.ca/floof/');
      if (res.data && res.data.image) {
        await ctx.replyWithPhoto({ url: res.data.image }, { caption: "🦊 Fox" });
      } else {
        await sendBanner(ctx, '🚫 No fox found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch fox.');
    }
  });
};