const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.hentai|\/hentai)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/hentai');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Hentai' });
      } else {
        await sendBanner(ctx, '🚫 No hentai image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch hentai.');
    }
  });
};