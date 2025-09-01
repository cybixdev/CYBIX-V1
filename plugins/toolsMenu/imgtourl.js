const axios = require("axios");
const FormData = require("form-data");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.on("photo", async ctx => {
    if (!ctx.message.caption || !ctx.message.caption.match(/^\.imgtourl$/i)) return;
    try {
      const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      const file = await ctx.telegram.getFile(file_id);
      const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      // Upload to imgbb (free image hosting)
      const form = new FormData();
      form.append("image", await axios.get(url, { responseType: "arraybuffer" }).then(r => Buffer.from(r.data).toString("base64")));
      const res = await axios.post("https://api.imgbb.com/1/upload?key=0e5c4c46d44e6c8f0b5e4c3e6e8c7b34", form, { headers: form.getHeaders() });
      if (res.data && res.data.data && res.data.data.url) {
        await ctx.replyWithPhoto(BANNER, {
          caption: `🌐 Image URL:\n${res.data.data.url}`,
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else {
        throw new Error("No URL");
      }
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Image2URL error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
  bot.hears(/^\.imgtourl$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "Send an image with the caption `.imgtourl`",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};