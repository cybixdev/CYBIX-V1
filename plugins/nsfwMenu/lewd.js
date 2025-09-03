const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('lewd', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/lewd');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Lewd' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch lewd.');
    }
  });
};