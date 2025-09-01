const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.blowjob$/i, async ctx => {
    try {
      const res = await axios.get("https://nekobot.xyz/api/image?type=blowjob");
      await ctx.replyWithPhoto(res.data.message, {
        caption: "👅 Blowjob",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Blowjob API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};