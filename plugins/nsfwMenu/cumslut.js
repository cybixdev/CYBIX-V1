const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.cumslut$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=cumslut");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "💦 Cumslut",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Cumslut API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};