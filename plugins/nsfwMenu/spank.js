const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.spank$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=spank");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🔥 Spank",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Spank API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};