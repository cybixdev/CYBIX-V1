const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.gonewild|\/gonewild)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://meme-api.com/gimme/gonewild');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Gonewild' });
      } else {
        await sendBanner(ctx, '🚫 No gonewild image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch gonewild.');
    }
  });
};