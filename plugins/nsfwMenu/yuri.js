const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('yuri', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/yuri');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Yuri' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch yuri.');
    }
  });
};