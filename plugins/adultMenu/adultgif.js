const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('adultgif', async (ctx) => {
    try {
      const res = await axios.get('https://api.lustdb.net/random/gif');
      if (res.data && res.data.url) {
        await ctx.replyWithAnimation({ url: res.data.url }, { caption: '🔞 Adult GIF' });
      } else {
        await sendBanner(ctx, '🚫 No adult gif found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch adult gif.');
    }
  });
};