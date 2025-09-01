const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.futa$/i, async ctx => {
    try {
      const url = `https://nekobot.xyz/api/image?type=futanari`;
      const { data } = await axios.get(url);
      await ctx.replyWithPhoto(data.message, {
        caption: "🦄 Futa",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Futa API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};