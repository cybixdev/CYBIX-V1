const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.meme$/i, async ctx => {
    try {
      const res = await axios.get("https://meme-api.com/gimme");
      await ctx.replyWithPhoto(res.data.url, {
        caption: `🤣 Meme\n${res.data.title} - r/${res.data.subreddit}`,
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Meme API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};