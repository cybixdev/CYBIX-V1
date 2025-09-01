const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.thighs$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=thigh");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "Thighs",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Thighs API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};