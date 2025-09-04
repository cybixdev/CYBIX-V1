const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.nsfwimg|\/nsfwimg)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.waifu.pics/nsfw/nsfw');
      if (res.data && res.data.url) {
        await ctx.replyWithPhoto({ url: res.data.url }, { caption: '🔞 NSFW Image' });
      } else {
        await sendBanner(ctx, '🚫 No NSFW image found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch NSFW image.');
    }
  });
};