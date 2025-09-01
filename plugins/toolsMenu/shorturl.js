const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.shorturl\s+(.+)/i, async ctx => {
    const url = ctx.match[1];
    try {
      const res = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
      await ctx.replyWithPhoto(BANNER, {
        caption: `🔗 Shortened URL:\n${res.data}`,
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ ShortURL error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};