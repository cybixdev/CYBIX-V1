const axios = require("axios");
const FormData = require("form-data");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.on("photo", async ctx => {
    if (!ctx.message.caption || !ctx.message.caption.match(/^\.img2pdf$/i)) return;
    try {
      const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      const file = await ctx.telegram.getFile(file_id);
      const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      const form = new FormData();
      form.append("file", await axios.get(url, { responseType: "arraybuffer" }).then(r => Buffer.from(r.data)), "image.jpg");
      const { data } = await axios.post("https://api.pdf.co/v1/pdf/convert/from/image", form, {
        headers: {
          ...form.getHeaders(),
          "x-api-key": "demo_api_key" // Replace with a real PDF.co API key for production
        }
      });
      if (data && data.url) {
        await ctx.replyWithDocument({ url: data.url }, {
          caption: "✅ Converted to PDF!",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else throw new Error("No PDF returned.");
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Image to PDF error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
  bot.hears(/^\.img2pdf$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "Send an image with caption `.img2pdf` to convert to PDF.",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};