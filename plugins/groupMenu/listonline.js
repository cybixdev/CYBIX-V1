const { sendForwarded } = require("../../libs/forwarded");

module.exports = {
  command: ".listonline",
  run: async (sock, m) => {
    const jid = m.key.remoteJid;
    try {
      const presences = await sock.groupFetchAllParticipating();
      const group = presences[jid];
      if (!group) {
        return sendForwarded(sock, jid, { text: "❌ Couldn't fetch group participants." });
      }
      const online = Object.values(group.participants)
        .filter(p => p.isOnline)
        .map(p => "• @" + p.jid.split("@")[0]);
      await sendForwarded(sock, jid, {
        text: online.length ?
          `🟢 Online participants:\n${online.join("\n")}` :
          "No one is online.",
        mentions: online.map(x => x.replace("• @", "") + "@s.whatsapp.net")
      });
    } catch (e) {
      await sendForwarded(sock, jid, { text: "❌ Error fetching online list." });
    }
  }
};