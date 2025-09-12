const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".blackbox",
  run: async (sock, m, args) => {
    await sendForwarded(sock, m.key.remoteJid, {
      text: "🧠 Blackbox AI is currently not set up. Please ask the owner to provide an API integration."
    });
  }
};