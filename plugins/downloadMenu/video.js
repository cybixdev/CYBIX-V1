const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('video', async (ctx) => {
    const q = ctx.message.text.replace(/^\.video\s*/, '') || 'https://youtube.com/watch?v=MwpMEbgC7DA';
    try {
      const res = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(q)}`);
      if (res.data && res.data.url) {
        await ctx.replyWithVideo({ url: res.data.url }, { caption: `🎬 Video` });
      } else {
        await sendBanner(ctx, '🚫 No video found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch video.');
    }
  });
};