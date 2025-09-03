const axios = require("axios");
module.exports = {
  run: async (ctx) => {
    const query = ctx.message.text.split(" ").slice(1).join(" ");
    if (!query) return ctx.reply("❌ Provide app name to search APK.");
    try {
      // Using AndroidAPKsFree search (public web scrape API, as sample)
      const url = `https://androidapksfree.com/?s=${encodeURIComponent(query)}`;
      await ctx.reply(`🔗 [Search for "${query}" APKs](${url})`, { parse_mode: "Markdown" });
    } catch (err) {
      console.error(err);
      ctx.reply("❌ Error finding APK.");
    }
  }
};