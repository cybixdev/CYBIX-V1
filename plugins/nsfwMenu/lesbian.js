const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.lesbian$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=lesbian");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🏳️‍🌈 Lesbian",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Lesbian API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};