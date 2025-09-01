const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.phind(?:\s+(.+))?$/i, async ctx => {
    const q = ctx.match[1];
    if (!q) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.phind your prompt`",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      // Using a public phind proxy
      const url = `https://api.safone.dev/phind?question=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      await ctx.replyWithPhoto(BANNER, {
        caption: `📝 *Phind AI*\n${res.data.answer || "No result!"}`,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Phind API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};