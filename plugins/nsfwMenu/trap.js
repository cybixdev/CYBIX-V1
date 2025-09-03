const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('trap', async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/trap');
      await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Trap' });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch trap.');
    }
  });
};