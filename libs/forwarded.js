const { newsletterJid, newsletterName } = require("../config/bot");

async function sendForwarded(sock, jid, content) {
  return sock.sendMessage(jid, {
    ...content,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName
      }
    }
  });
}

module.exports = { sendForwarded };