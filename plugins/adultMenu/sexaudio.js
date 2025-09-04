const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.sexaudio|\/sexaudio)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.lustdb.net/random/audio');
      if (res.data && res.data.url) {
        await ctx.replyWithAudio({ url: res.data.url }, { caption: '🔊 Sex Audio' });
      } else {
        await sendBanner(ctx, '🚫 No sex audio found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch sex audio.');
    }
  });
};