const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.blowjob|\/blowjob)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/blowjob');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 Blowjob' });
      } else {
        await sendBanner(ctx, '🚫 No blowjob image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch blowjob.');
    }
  });
};