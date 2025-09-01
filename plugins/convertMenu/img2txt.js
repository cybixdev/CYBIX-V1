const axios = require("axios");
const FormData = require("form-data");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.on("photo", async ctx => {
    if (!ctx.message.caption || !ctx.message.caption.match(/^\.img2text$/i)) return;
    try {
      const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      const file = await ctx.telegram.getFile(file_id);
      const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      const form = new FormData();
      form.append("file", await axios.get(url, { responseType: "arraybuffer" }).then(r => Buffer.from(r.data)), "image.jpg");
      const { data } = await axios.post("https://api.ocr.space/parse/image", form, {
        headers: form.getHeaders()
      });
      if (data && data.ParsedResults && data.ParsedResults[0] && data.ParsedResults[0].ParsedText) {
        await ctx.replyWithPhoto(BANNER, {
          caption: `🔤 Image Text:\n${data.ParsedResults[0].ParsedText.trim()}`,
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else throw new Error("No text found.");
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Image to Text error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
  bot.hears(/^\.img2text$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "Send an image with caption `.img2text` to extract text from image.",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};