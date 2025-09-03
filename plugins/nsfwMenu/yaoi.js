const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('yaoi', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/yaoi');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Yaoi' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch yaoi.');
    }
  });
};