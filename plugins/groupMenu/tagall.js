const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".tagall",
  run: async (sock, m) => {
    const jid = m.key.remoteJid;
    try {
      const metadata = await sock.groupMetadata(jid);
      const participants = metadata.participants.map(p => p.id);
      const mentions = participants;
      const text = "👥 Tagging all group members:\n" + participants.map(u => `@${u.split("@")[0]}`).join(" ");
      await sendForwarded(sock, jid, { text, mentions });
    } catch (e) {
      await sendForwarded(sock, jid, { text: "❌ Failed to tag all." });
    }
  }
};