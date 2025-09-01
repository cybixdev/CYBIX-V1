const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.bard(?:\s+(.+))?$/i, async ctx => {
    const q = ctx.match[1];
    if (!q) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.bard your prompt`",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      // Using a public Bard API proxy (replace if rate-limited)
      const url = `https://aemt.me/bard?text=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      await ctx.replyWithPhoto(BANNER, {
        caption: `🌟 *Bard AI*\n${res.data.result || res.data.answer || "No result!"}`,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Bard API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};