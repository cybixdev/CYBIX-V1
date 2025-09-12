const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".promote",
  run: async (sock, m, args) => {
    const jid = m.key.remoteJid;
    let user = args[0];
    if (!user && m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    if (!user) return sendForwarded(sock, jid, { text: "❌ Usage: .promote @number" });
    try {
      await sock.groupParticipantsUpdate(jid, [user], "promote");
      await sendForwarded(sock, jid, { text: `✅ Promoted: @${user.split("@")[0]}`, mentions: [user] });
    } catch (e) {
      await sendForwarded(sock, jid, { text: "❌ Failed to promote user." });
    }
  }
};