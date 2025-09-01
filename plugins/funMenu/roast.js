const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.roast$/i, async ctx => {
    try {
      const res = await axios.get("https://evilinsult.com/generate_insult.php?lang=en&type=json");
      await ctx.replyWithPhoto(BANNER, {
        caption: `🔥 Roast\n${res.data.insult}`,
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Roast API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};