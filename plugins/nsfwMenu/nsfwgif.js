const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.nsfwgif$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=anal");
      await ctx.replyWithAnimation(res.data.message, {
        caption: "🔞 NSFW GIF",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ NSFWGIF API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};