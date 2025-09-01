const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.anal$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=anal");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🍑 Anal",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Anal API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};