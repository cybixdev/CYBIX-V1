const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.pussy$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=pussy");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🐱 Pussy",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Pussy API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};