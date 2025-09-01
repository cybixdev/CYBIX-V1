const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.ytmp3(?:\s+(.+))?$/i, async ctx => {
    const q = ctx.match[1];
    if (!q) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.ytmp3 <youtube-url>` (download YouTube audio)",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      const url = `https://api.safone.dev/ytmp3?url=${encodeURIComponent(q)}`;
      const { data } = await axios.get(url);
      if (data && data.result && data.result.url) {
        await ctx.replyWithAudio({ url: data.result.url }, {
          caption: `🎧 *YouTube MP3*\n${q}`,
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else {
        await ctx.replyWithPhoto(BANNER, {
          caption: "❌ No MP3 found.",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      }
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ YTMP3 API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};