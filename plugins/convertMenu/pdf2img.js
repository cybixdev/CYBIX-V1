const axios = require("axios");
const FormData = require("form-data");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.on("document", async ctx => {
    if (!ctx.message.caption || !ctx.message.caption.match(/^\.pdf2img$/i)) return;
    try {
      const file_id = ctx.message.document.file_id;
      const file = await ctx.telegram.getFile(file_id);
      const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      const form = new FormData();
      form.append("file", await axios.get(url, { responseType: "arraybuffer" }).then(r => Buffer.from(r.data)), "file.pdf");
      const { data } = await axios.post("https://api.pdf.co/v1/pdf/convert/to/jpg", form, {
        headers: {
          ...form.getHeaders(),
          "x-api-key": "demo_api_key" // Replace with your real PDF.co API key
        }
      });
      if (data && data.urls && data.urls.length > 0) {
        for (const img of data.urls) {
          await ctx.replyWithPhoto(img, {
            caption: "🖼️ PDF Page as Image",
            reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
          });
        }
      } else throw new Error("No images returned.");
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ PDF to Image error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
  bot.hears(/^\.pdf2img$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "Send a PDF with caption `.pdf2img` to convert each page to image.",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};