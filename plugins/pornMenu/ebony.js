const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.ebony$/i, async ctx => {
    try {
      const url = `https://nekobot.xyz/api/image?type=ebony`;
      const { data } = await axios.get(url);
      await ctx.replyWithPhoto(data.message, {
        caption: "🍫 Ebony",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Ebony API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};