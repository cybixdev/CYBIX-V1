const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.milf$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=milf");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "👩 Milf",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Milf API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};