const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.nsfwpic$/i, async ctx => {
    try {
      const res = await axios.get("https://api.waifu.pics/nsfw/waifu");
      await ctx.replyWithPhoto(res.data.url, {
        caption: "🔞 NSFW Pic",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ NSFWPic API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};