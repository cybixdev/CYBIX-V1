const { sendForwarded } = require("../../libs/forwarded");
const os = require("os");
const prettyMs = require("pretty-ms");

module.exports = {
  command: ".runtime",
  run: async (sock, m) => {
    const uptime = prettyMs(os.uptime() * 1000, { verbose: true });
    await sendForwarded(sock, m.key.remoteJid, {
      text: `⏱️ Bot runtime: ${uptime}`
    });
  }
};