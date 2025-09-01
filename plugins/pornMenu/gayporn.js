const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.gayporn$/i, async ctx => {
    try {
      const url = `https://nekobot.xyz/api/image?type=yaoi`;
      const { data } = await axios.get(url);
      await ctx.replyWithPhoto(data.message, {
        caption: "👨‍❤️‍👨 Gay Porn",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ GayPorn API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};