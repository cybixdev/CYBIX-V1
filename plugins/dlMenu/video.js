const axios = require("axios");
module.exports = {
  run: async (ctx) => {
    const query = ctx.message.text.split(" ").slice(1).join(" ");
    if (!query) return ctx.reply("❌ Provide keyword for video.");
    try {
      // Using Pexels Video API (demo, public endpoint)
      const url = `https://www.pexels.com/search/videos/${encodeURIComponent(query)}/`;
      await ctx.reply(`🔗 [Watch videos for "${query}" on Pexels](${url})`, { parse_mode: "Markdown" });
    } catch (err) {
      console.error(err);
      ctx.reply("❌ Error fetching video.");
    }
  }
};