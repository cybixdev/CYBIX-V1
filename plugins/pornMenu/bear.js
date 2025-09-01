const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.bear$/i, async ctx => {
    try {
      const url = `https://nekobot.xyz/api/image?type=bear`;
      const { data } = await axios.get(url);
      await ctx.replyWithPhoto(data.message, {
        caption: "🐻 Bear",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Bear API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};