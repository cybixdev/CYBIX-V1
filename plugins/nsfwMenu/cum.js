const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.cum$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=cum");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "💦 Cum",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Cum API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};