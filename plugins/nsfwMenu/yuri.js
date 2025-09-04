const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.yuri|\/yuri)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/yuri');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Yuri' });
      } else {
        await sendBanner(ctx, '🚫 No yuri image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch yuri.');
    }
  });
};