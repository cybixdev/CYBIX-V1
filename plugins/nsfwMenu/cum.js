const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('cum', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/cum');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Cum' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch cum.');
    }
  });
};