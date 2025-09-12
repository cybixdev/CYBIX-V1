const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".gemini",
  run: async (sock, m, args) => {
    await sendForwarded(sock, m.key.remoteJid, {
      text: "💎 Gemini AI is not configured. Please add your Gemini API integration."
    });
  }
};