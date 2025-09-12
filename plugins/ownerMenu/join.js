const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".join",
  run: async (sock, m, args) => {
    if (!args.length) {
      return sendForwarded(sock, m.key.remoteJid, { text: "❌ Usage: .join <group invite link/code>" });
    }
    const invite = args[0].includes("whatsapp.com") ? args[0].split("/").pop() : args[0];
    try {
      await sock.groupAcceptInvite(invite);
      await sendForwarded(sock, m.key.remoteJid, { text: "✅ Successfully joined group." });
    } catch (e) {
      await sendForwarded(sock, m.key.remoteJid, { text: "❌ Failed to join group. Check the invite code/link." });
    }
  }
};