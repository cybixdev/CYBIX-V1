const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".kickall",
  run: async (sock, m) => {
    const jid = m.key.remoteJid;
    try {
      const metadata = await sock.groupMetadata(jid);
      const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
      const members = metadata.participants.filter(p => !p.admin).map(p => p.id);
      if (!members.length) return sendForwarded(sock, jid, { text: "❌ No members to kick." });
      await sendForwarded(sock, jid, { text: "🚨 Kicking all non-admin members..." });
      for (const user of members) {
        await sock.groupParticipantsUpdate(jid, [user], "remove");
      }
      await sendForwarded(sock, jid, { text: "✅ All non-admins kicked." });
    } catch (e) {
      await sendForwarded(sock, jid, { text: "❌ Error during kickall." });
    }
  }
};