const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.cum|\/cum)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/cum');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Cum' });
      } else {
        await sendBanner(ctx, '🚫 No cum image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch cum.');
    }
  });
};