const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('ecchi', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/ecchi');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Ecchi' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch ecchi.');
    }
  });
};