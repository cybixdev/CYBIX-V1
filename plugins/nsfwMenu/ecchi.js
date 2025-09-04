const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.ecchi|\/ecchi)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/ecchi');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Ecchi' });
      } else {
        await sendBanner(ctx, '🚫 No ecchi image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch ecchi.');
    }
  });
};