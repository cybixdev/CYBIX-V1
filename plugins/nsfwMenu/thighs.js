const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('thighs', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/thighs');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Thighs' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch thighs.');
    }
  });
};