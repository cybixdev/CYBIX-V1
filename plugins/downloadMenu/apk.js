const { sendForwarded } = require("../../libs/forwarded");
const axios = require("axios");

module.exports = {
  command: ".chatgpt",
  run: async (sock, m, args) => {
    if (!args.length)
      return sendForwarded(sock, m.key.remoteJid, { text: "❌ Usage: .chatgpt <your question>" });
    const prompt = args.join(" ");
    try {
      // Uses a free public API
      const res = await axios.get("https://api.affiliateplus.xyz/api/chatgpt", { params: { message: prompt } });
      await sendForwarded(sock, m.key.remoteJid, { text: res.data.reply || "No answer!" });
    } catch (e) {
      await sendForwarded(sock, m.key.remoteJid, { text: "❌ Error: Could not contact AI API." });
    }
  }
};