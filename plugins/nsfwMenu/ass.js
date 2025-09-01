const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.ass$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=ass");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🍑 Ass",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Ass API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};