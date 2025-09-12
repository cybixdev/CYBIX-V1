const { sendForwarded } = require("../../libs/forwarded");
const axios = require("axios");

module.exports = {
  command: ".play",
  run: async (sock, m, args) => {
    if (!args.length) {
      return sendForwarded(sock, m.key.remoteJid, { text: "❌ Usage: .play <song name>" });
    }
    const query = args.join(" ");
    try {
      // Uses public API from https://api.lolhuman.xyz/docs/#music
      const key = "demo"; // Replace with your actual lolhuman API key!
      const res = await axios.get(`https://api.lolhuman.xyz/api/ytplay?apikey=${key}&query=${encodeURIComponent(query)}`);
      const result = res.data.result;
      await sendForwarded(sock, m.key.remoteJid, {
        audio: { url: result.audio },
        mimetype: "audio/mp4",
        fileName: result.title + ".mp3",
        caption: `🎵 ${result.title}\nBy: ${result.author}\nDuration: ${result.duration}`
      });
    } catch (e) {
      await sendForwarded(sock, m.key.remoteJid, { text: "❌ Failed to fetch music." });
    }
  }
};