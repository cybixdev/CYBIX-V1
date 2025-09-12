const { sendForwarded } = require("../../libs/forwarded");
const axios = require("axios");

module.exports = {
  command: ".dltiktok",
  run: async (sock, m, args) => {
    if (!args.length)
      return sendForwarded(sock, m.key.remoteJid, { text: "❌ Usage: .dltiktok <tiktok link>" });
    const url = args[0];
    try {
      // Uses public API from https://tikwm.com/
      const res = await axios.get(`https://api.tikwm.com/video/info?url=${encodeURIComponent(url)}`);
      if (res.data && res.data.data && res.data.data.play) {
        await sendForwarded(sock, m.key.remoteJid, {
          video: { url: res.data.data.play },
          mimetype: "video/mp4",
          caption: res.data.data.title || "TikTok Video"
        });
      } else {
        await sendForwarded(sock, m.key.remoteJid, { text: "❌ Failed to download TikTok video." });
      }
    } catch (e) {
      await sendForwarded(sock, m.key.remoteJid, { text: "❌ Error contacting TikTok API." });
    }
  }
};