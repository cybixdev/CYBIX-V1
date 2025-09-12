const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".leave",
  run: async (sock, m, args) => {
    if (!args.length) {
      return sendForwarded(sock, m.key.remoteJid, { text: "❌ Usage: .leave <group JID>" });
    }
    const groupJid = args[0];
    try {
      await sock.groupLeave(groupJid);
      await sendForwarded(sock, m.key.remoteJid, { text: `🚪 Left group: ${groupJid}` });
    } catch (e) {
      await sendForwarded(sock, m.key.remoteJid, { text: "❌ Failed to leave group." });
    }
  }
};