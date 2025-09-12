const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".opengc",
  run: async (sock, m) => {
    const jid = m.key.remoteJid;
    try {
      await sock.groupSettingUpdate(jid, "not_announcement");
      await sendForwarded(sock, jid, { text: "✅ Group is now open for all members to send messages." });
    } catch (e) {
      await sendForwarded(sock, jid, { text: "❌ Failed to open group. Make sure this is a group and you are admin." });
    }
  }
};