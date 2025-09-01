const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.translate\s+([a-z]{2})\s+(.+)/i, async ctx => {
    const lang = ctx.match[1];
    const text = ctx.match[2];
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await axios.get(url);
      const translated = res.data[0][0][0];
      await ctx.replyWithPhoto(BANNER, {
        caption: `🌍 Translation [${lang}]:\n${translated}`,
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Translate error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
  bot.hears(/^\.translate$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "Usage:\n.translate <lang> <text>\nExample:\n.translate fr Hello world",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};