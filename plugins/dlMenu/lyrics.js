const axios = require("axios");
module.exports = {
  run: async (ctx) => {
    const query = ctx.message.text.split(" ").slice(1).join(" ");
    if (!query) return ctx.reply("❌ Provide song name for lyrics.");
    try {
      const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`);
      if (!res.data || !res.data.lyrics) return ctx.reply("❌ Lyrics not found.");
      await ctx.reply(`📝 *Lyrics for ${query}:*\n\n${res.data.lyrics}`, { parse_mode: "Markdown" });
    } catch (err) {
      console.error(err);
      ctx.reply("❌ Error fetching lyrics.");
    }
  }
};