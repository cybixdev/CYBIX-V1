const axios = require("axios");
module.exports = {
  run: async (ctx) => {
    const query = ctx.message.text.split(" ").slice(1).join(" ");
    if (!query) return ctx.reply("❌ Please provide a song name.");
    try {
      const searchUrl = `https://ytsearch-api.vercel.app/search?query=${encodeURIComponent(query)}`;
      const searchRes = await axios.get(searchUrl);
      if (!searchRes.data || !searchRes.data[0]) return ctx.reply("❌ No results found.");
      const videoUrl = searchRes.data[0].url;
      const apiUrl = `https://phi-star.vercel.app/api/ytmp3?url=${videoUrl}`;
      const response = await axios.get(apiUrl);
      if (!response.data.success) return ctx.reply("⚠️ Failed to convert video to audio.");
      const audioUrl = response.data.data.downloadURL;
      await ctx.replyWithAudio({ url: audioUrl }, {
        title: query,
        performer: "YouTube",
        caption: `🎶 Now playing: *${query}*`,
        parse_mode: "Markdown"
      });
    } catch (err) {
      console.error(err);
      ctx.reply("❌ Error fetching audio.");
    }
  }
};