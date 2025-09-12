const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".repo",
  run: async (sock, m) => {
    await sendForwarded(sock, m.key.remoteJid, {
      text: "🌐 GitHub Repository:\nhttps://github.com/JadenAfrix1/queen-zaya-v1"
    });
  }
};