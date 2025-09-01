const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.triplelesbian$/i, async ctx => {
    try {
      const url = `https://nekobot.xyz/api/image?type=lesbian`;
      const { data } = await axios.get(url);
      await ctx.replyWithPhoto(data.message, {
        caption: "👩‍❤️‍👩 Triple Lesbian",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ TripleLesbian API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};