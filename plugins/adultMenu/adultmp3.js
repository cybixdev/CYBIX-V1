const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.adultmp3|\/adultmp3)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.lustdb.net/random/audio');
      if (res.data && res.data.url) {
        await ctx.replyWithAudio({ url: res.data.url }, { caption: '🔊 Adult MP3' });
      } else {
        await sendBanner(ctx, '🚫 No adult mp3 found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch adult mp3.');
    }
  });
};