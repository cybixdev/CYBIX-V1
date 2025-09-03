const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('boobs', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/boobs');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Boobs' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch boobs.');
    }
  });
};