const { sendForwarded } = require("../../libs/forwarded");
const axios = require("axios");

module.exports = {
  command: ".video",
  run: async (sock, m, args) => {
    if (!args.length) {
      return sendForwarded(sock, m.key.remoteJid, { text: "❌ Usage: .video <YouTube link or search>" });
    }
    const query = args.join(" ");
    try {
      // Uses public API from https://api.lolhuman.xyz/docs/#video
      const key = "demo"; // Replace with your actual lolhuman API key!
      const res = await axios.get(`https://api.lolhuman.xyz/api/ytvideo?apikey=${key}&url=${encodeURIComponent(query)}`);
      const result = res.data.result;
      await sendForwarded(sock, m.key.remoteJid, {
        video: { url: result.link },
        mimetype: "video/mp4",
        fileName: result.title + ".mp4",
        caption: `📹 ${result.title}\nBy: ${result.uploader}\nDuration: ${result.duration}`
      });
    } catch (e) {
      await sendForwarded(sock, m.key.remoteJid, { text: "❌ Failed to fetch video." });
    }
  }
};