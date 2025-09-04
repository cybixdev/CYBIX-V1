const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.trap|\/trap)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/trap');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Trap' });
      } else {
        await sendBanner(ctx, '🚫 No trap image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch trap.');
    }
  });
};