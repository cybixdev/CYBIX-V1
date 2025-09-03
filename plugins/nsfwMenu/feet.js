const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('feet', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/feet');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Feet' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch feet.');
    }
  });
};