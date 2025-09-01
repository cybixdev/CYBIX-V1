const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.publicsex$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=public");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🌆 Public Sex",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Publicsex API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};