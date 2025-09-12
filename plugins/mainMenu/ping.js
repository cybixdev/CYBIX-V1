const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".ping",
  run: async (sock, m) => {
    const start = Date.now();
    await sendForwarded(sock, m.key.remoteJid, { text: "🏓 Pinging..." });
    const ms = Date.now() - start;
    await sendForwarded(sock, m.key.remoteJid, { text: `🏓 Pong! ${ms}ms` });
  }
};