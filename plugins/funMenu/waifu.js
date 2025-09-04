const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.waifu|\/waifu)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/sfw/waifu');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: "💖 Waifu" });
      } else {
        await sendBanner(ctx, '🚫 No waifu found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch waifu.');
    }
  });
};