const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.lewd|\/lewd)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/lewd');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Lewd' });
      } else {
        await sendBanner(ctx, '🚫 No lewd image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch lewd.');
    }
  });
};