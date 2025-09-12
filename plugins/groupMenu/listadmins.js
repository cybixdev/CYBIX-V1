const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".listadmin",
  run: async (sock, m) => {
    const jid = m.key.remoteJid;
    try {
      const metadata = await sock.groupMetadata(jid);
      const admins = metadata.participants.filter(p => p.admin).map(p => "• @" + p.id.split("@")[0]);
      await sendForwarded(sock, jid, {
        text: admins.length ?
          "👮 Group Admins:\n" + admins.join("\n") :
          "No admins found.",
        mentions: admins.map(x => x.replace("• @", "") + "@s.whatsapp.net")
      });
    } catch (e) {
      await sendForwarded(sock, jid, { text: "❌ Error fetching admins." });
    }
  }
};