const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".text2img",
  run: async (sock, m, args) => {
    await sendForwarded(sock, m.key.remoteJid, {
      text: "🌐 NOT AVAILABLE FOR NO2."
    });
  }
};