const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.weather\s+(.+)/i, async ctx => {
    const city = ctx.match[1];
    try {
      const url = `https://wttr.in/${encodeURIComponent(city)}?format=3`;
      const res = await axios.get(url);
      await ctx.replyWithPhoto(BANNER, {
        caption: `🌦️ Weather:\n${res.data}`,
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Weather error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};