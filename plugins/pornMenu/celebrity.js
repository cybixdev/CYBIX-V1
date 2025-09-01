const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.celebrity$/i, async ctx => {
    try {
      const url = `https://nekobot.xyz/api/image?type=celeb`;
      const { data } = await axios.get(url);
      await ctx.replyWithPhoto(data.message, {
        caption: "🧑‍🎤 Celebrity",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Celebrity API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};