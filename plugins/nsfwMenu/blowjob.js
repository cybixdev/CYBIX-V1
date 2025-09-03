const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('blowjob', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/blowjob');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Blowjob' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch blowjob.');
    }
  });
};