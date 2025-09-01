const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.dick$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=dick");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🍆 Dick",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Dick API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};