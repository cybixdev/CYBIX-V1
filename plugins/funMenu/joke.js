const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.joke$/i, async ctx => {
    try {
      const res = await axios.get("https://v2.jokeapi.dev/joke/Any?safe-mode&type=single");
      await ctx.replyWithPhoto(BANNER, {
        caption: `😂 Joke\n${res.data.joke}`,
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Joke API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};