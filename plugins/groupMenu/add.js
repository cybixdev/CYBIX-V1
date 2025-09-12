const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".add",
  run: async (sock, m, args) => {
    const jid = m.key.remoteJid;
    let user = args[0];
    if (!user) return sendForwarded(sock, jid, { text: "❌ Usage: .add <number>" });
    user = user.replace(/\D/g, "") + "@s.whatsapp.net";
    try {
      await sock.groupParticipantsUpdate(jid, [user], "add");
      await sendForwarded(sock, jid, { text: `✅ Added: @${user.split("@")[0]}`, mentions: [user] });
    } catch (e) {
      await sendForwarded(sock, jid, { text: "❌ Failed to add user. User may not allow group invitations." });
    }
  }
};