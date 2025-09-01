const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.bdsm$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=bdsm");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🔗 BDSM",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ BDSM API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};