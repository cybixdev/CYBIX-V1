const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.kissing$/i, async ctx => {
    try {
      const url = `https://nekobot.xyz/api/image?type=kissing`;
      const { data } = await axios.get(url);
      await ctx.replyWithPhoto(data.message, {
        caption: "💋 Kissing",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Kissing API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};