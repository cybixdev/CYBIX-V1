const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.video(?:\s+(.+))?$/i, async ctx => {
    const q = ctx.match[1];
    if (!q) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.video <youtube-url>` (download YouTube video)",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      const url = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(q)}`;
      const { data } = await axios.get(url);
      if (data && data.result && data.result.url) {
        await ctx.replyWithVideo({ url: data.result.url }, {
          caption: `🎬 *YouTube Video*\n${q}`,
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else {
        await ctx.replyWithPhoto(BANNER, {
          caption: "❌ No video found.",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      }
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Video API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};