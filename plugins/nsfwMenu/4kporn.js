const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.4kporn$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=4k");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "🎥 4K Porn",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ 4KPorn API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};