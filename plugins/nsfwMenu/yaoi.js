const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.yaoi|\/yaoi)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/yaoi');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Yaoi' });
      } else {
        await sendBanner(ctx, '🚫 No yaoi image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch yaoi.');
    }
  });
};