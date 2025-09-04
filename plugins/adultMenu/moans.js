const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.moans|\/moans)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.lustdb.net/random/audio');
      if (res.data && res.data.url) {
        await ctx.replyWithAudio({ url: res.data.url }, { caption: '🔊 Moans' });
      } else {
        await sendBanner(ctx, '🚫 No moans found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch moans.');
    }
  });
};