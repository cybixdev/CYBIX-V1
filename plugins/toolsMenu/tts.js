const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.tts\s+([a-z]{2})\s+(.+)/i, async ctx => {
    const lang = ctx.match[1];
    const text = ctx.match[2];
    try {
      const url = `https://api.safone.dev/tts?lang=${lang}&text=${encodeURIComponent(text)}`;
      const { data } = await axios.get(url, { responseType: "arraybuffer" });
      await ctx.replyWithAudio({ source: Buffer.from(data) }, {
        caption: `🗣️ TTS [${lang}]`,
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ TTS error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
  bot.hears(/^\.tts$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "Usage:\n.tts <lang> <text>\nExample:\n.tts en Hello world",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};