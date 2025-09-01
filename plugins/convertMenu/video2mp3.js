const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.video2mp3\s+(.+)/i, async ctx => {
    const url = ctx.match[1];
    try {
      const req = await axios.get(`https://api.safone.dev/ytmp3?url=${encodeURIComponent(url)}`);
      if (req.data && req.data.result && req.data.result.url) {
        await ctx.replyWithAudio({ url: req.data.result.url }, {
          caption: "🎧 Video converted to MP3!",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else throw new Error("No MP3 found.");
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Video2MP3 error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
  bot.hears(/^\.video2mp3$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "Usage: `.video2mp3 <video-url>` (e.g. .video2mp3 https://youtu.be/xxxx)",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};