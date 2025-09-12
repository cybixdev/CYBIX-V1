const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".sc",
  run: async (sock, m) => {
    await sendForwarded(sock, m.key.remoteJid, {
      text: "🔗 Source code: https://github.com/JadenAfrix1/queen-zaya-v1"
    });
  }
};