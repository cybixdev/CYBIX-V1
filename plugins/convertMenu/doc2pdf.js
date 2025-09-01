const axios = require("axios");
const FormData = require("form-data");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.on("document", async ctx => {
    if (!ctx.message.caption || !ctx.message.caption.match(/^\.doc2pdf$/i)) return;
    try {
      const file_id = ctx.message.document.file_id;
      const file = await ctx.telegram.getFile(file_id);
      const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      const form = new FormData();
      form.append("file", await axios.get(url, { responseType: "arraybuffer" }).then(r => Buffer.from(r.data)), "file.docx");
      const { data } = await axios.post("https://api.pdf.co/v1/pdf/convert/from/doc", form, {
        headers: {
          ...form.getHeaders(),
          "x-api-key": "demo_api_key" // Replace with your real PDF.co API key
        }
      });
      if (data && data.url) {
        await ctx.replyWithDocument({ url: data.url }, {
          caption: "✅ DOCX converted to PDF!",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else throw new Error("No PDF returned.");
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ DOCX to PDF error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
  bot.hears(/^\.doc2pdf$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "Send a DOCX with caption `.doc2pdf` to convert to PDF.",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};