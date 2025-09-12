const { sendForwarded } = require("../../libs/forwarded");
const { ownerNumber, ownerName } = require("../../config/bot");

module.exports = {
  command: ".owner",
  run: async (sock, m) => {
    await sendForwarded(sock, m.key.remoteJid, {
      text: `👑 Owner: ${ownerName}\n📱 Number: +${ownerNumber}\n`
    });
  }
};