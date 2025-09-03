const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('play', async (ctx) => {
    const q = ctx.message.text.replace(/^\.play\s*/, '') || 'Faded';
    try {
      const res = await axios.get(`https://apis.davidcyriltech.my.id/song?query=${encodeURIComponent(q)}`);
      if (res.data && res.data.url) {
        await ctx.replyWithAudio({ url: res.data.url }, { caption: `🎵 Playing: ${q}` });
      } else {
        await sendBanner(ctx, '🚫 No song found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch song.');
    }
  });
};