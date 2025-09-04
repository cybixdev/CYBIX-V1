const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.thighs|\/thighs)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/thighs');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Thighs' });
      } else {
        await sendBanner(ctx, '🚫 No thighs image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch thighs.');
    }
  });
};