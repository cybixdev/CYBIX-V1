const axios = require("axios");
module.exports = {
  run: async (ctx) => {
    const query = ctx.message.text.split(" ").slice(1).join(" ");
    if (!query) return ctx.reply("❌ Provide keyword for image.");
    try {
      // Using Unsplash API (demo, public endpoint)
      const url = `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`;
      await ctx.replyWithPhoto(url, { caption: `🖼️ Image for: ${query}` });
    } catch (err) {
      console.error(err);
      ctx.reply("❌ Error fetching image.");
    }
  }
};