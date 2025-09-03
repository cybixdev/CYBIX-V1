const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('hentai', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/hentai');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Hentai' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch hentai.');
    }
  });
};