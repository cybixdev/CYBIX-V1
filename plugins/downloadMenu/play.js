const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.play|\/play)\s+(.+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://api.lolhuman.xyz/api/spotify?apikey=demo&q=${encodeURIComponent(q)}`);
      if (res.data && res.data.result && res.data.result.audio_url) {
        await ctx.replyWithAudio({ url: res.data.result.audio_url }, { caption: `🎵 Playing: ${q}` });
      } else {
        await sendBanner(ctx, '🚫 No song found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch song.');
    }
  });
};