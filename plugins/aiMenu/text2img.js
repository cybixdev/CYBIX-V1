const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".text2img",
  run: async (sock, m, args) => {
    await sendForwarded(sock, m.key.remoteJid, {
      text: "🖼️ Text2Image is not set up yet. Please add your image generation API integration."
    });
  }
};