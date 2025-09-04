const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.ass|\/ass)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/ass');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Ass' });
      } else {
        await sendBanner(ctx, '🚫 No ass image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch ass.');
    }
  });
};