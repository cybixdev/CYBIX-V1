const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".closegc",
  run: async (sock, m) => {
    const jid = m.key.remoteJid;
    try {
      await sock.groupSettingUpdate(jid, "announcement");
      await sendForwarded(sock, jid, { text: "🔒 Group is now closed. Only admins can send messages." });
    } catch (e) {
      await sendForwarded(sock, jid, { text: "❌ Failed to close group. Make sure this is a group and you are admin." });
    }
  }
};