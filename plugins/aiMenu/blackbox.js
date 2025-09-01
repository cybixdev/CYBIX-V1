const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.blackbox(?:\s+(.+))?$/i, async ctx => {
    const q = ctx.match[1];
    if (!q) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.blackbox your prompt`",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      const url = `https://apis.davidcyriltech.my.id/blackbox?q=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      const text = res.data.result || res.data.response || "No result!";
      await ctx.replyWithPhoto(BANNER, {
        caption: `🧠 *Blackbox AI*\n${text}`,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Blackbox API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};