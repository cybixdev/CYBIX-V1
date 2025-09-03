const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('gonewild', async (ctx) => {
    try {
      const res = await axios.get('https://meme-api.com/gimme/gonewild');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Gonewild' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch gonewild.');
    }
  });
};