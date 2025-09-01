const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.boobs$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=boobs");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "👙 Boobs",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Boobs API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};