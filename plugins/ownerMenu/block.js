const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".block",
  run: async (sock, m, args) => {
    if (!args.length) {
      return sendForwarded(sock, m.key.remoteJid, { text: "❌ Usage: .block <number with country code>" });
    }
    let number = args[0].replace(/[^0-9]/g, "");
    if (!number.endsWith("@s.whatsapp.net")) number += "@s.whatsapp.net";
    try {
      await sock.updateBlockStatus(number, "block");
      await sendForwarded(sock, m.key.remoteJid, { text: `🚫 Blocked ${args[0]}` });
    } catch (e) {
      await sendForwarded(sock, m.key.remoteJid, { text: "❌ Failed to block user." });
    }
  }
};