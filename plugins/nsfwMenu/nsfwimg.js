const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('nsfwimg', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/nsfw');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 NSFW Image' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch NSFW image.');
    }
  });
};