const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.facesitting$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=facesitting");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🤤 Facesitting",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Facesitting API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};