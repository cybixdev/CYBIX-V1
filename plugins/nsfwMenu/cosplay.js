const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.cosplay$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=cosplay");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🎭 Cosplay",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Cosplay API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};