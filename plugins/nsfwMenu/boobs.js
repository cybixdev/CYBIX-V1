const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.boobs|\/boobs)$/i, async (ctx) => {
    try {
      // imgur api returns random boobs images
      const res = await axios.get('https://api.waifu.pics/nsfw/boobs');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Boobs' });
      } else {
        await sendBanner(ctx, '🚫 No boobs image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch boobs.');
    }
  });
};