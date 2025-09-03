const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('ass', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/ass');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Ass' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch ass.');
    }
  });
};