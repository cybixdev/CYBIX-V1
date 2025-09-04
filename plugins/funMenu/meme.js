const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.meme|\/meme)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://meme-api.com/gimme');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: res.data.title });
      } else {
        await sendBanner(ctx, '🚫 No meme found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch meme.');
    }
  });
};