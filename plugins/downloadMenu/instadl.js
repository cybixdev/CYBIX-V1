const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.instadl(?:\s+(.+))?$/i, async ctx => {
    const q = ctx.match[1];
    if (!q) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.instadl <instagram-post-link>`",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      const url = `https://api.safone.dev/instagram?url=${encodeURIComponent(q)}`;
      const { data } = await axios.get(url);
      if (data && data.result && data.result.media && data.result.media.length > 0) {
        for (const mediaUrl of data.result.media) {
          if (mediaUrl.endsWith('.mp4')) {
            await ctx.replyWithVideo({ url: mediaUrl }, {
              caption: `📸 Instagram Video`,
              reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
            });
          } else {
            await ctx.replyWithPhoto({ url: mediaUrl }, {
              caption: `📸 Instagram Photo`,
              reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
            });
          }
        }
      } else {
        await ctx.replyWithPhoto(BANNER, {
          caption: "❌ No media found.",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      }
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ InstaDL API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};