const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.chatgpt(?:\s+(.+))?$/i, async ctx => {
    const q = ctx.match[1];
    if (!q) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.chatgpt <your question>`",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      const url = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      const text = res.data.result || res.data.response || "No result!";
      await ctx.replyWithPhoto(BANNER, {
        caption: `🤖 *ChatGPT*\n${text}`,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ ChatGPT API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};