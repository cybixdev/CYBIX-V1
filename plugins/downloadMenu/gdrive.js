const { sendForwarded } = require("../../libs/forwarded");
const axios = require("axios");

module.exports = {
  command: ".gdrive",
  run: async (sock, m, args) => {
    if (!args.length)
      return sendForwarded(sock, m.key.remoteJid, { text: "❌ Usage: .gdrive <Google Drive file URL>" });
    const url = args[0];
    // Uses a public Google Drive direct link generator
    try {
      const res = await axios.get(`https://api.gdriveapi.xyz/api/download?url=${encodeURIComponent(url)}`);
      if (res.data && res.data.status === "success") {
        await sendForwarded(sock, m.key.remoteJid, {
          document: { url: res.data.result.downloadUrl },
          fileName: res.data.result.fileName,
          mimetype: res.data.result.mimeType,
          caption: `✅ File: ${res.data.result.fileName}\nSize: ${res.data.result.size}`
        });
      } else {
        await sendForwarded(sock, m.key.remoteJid, { text: "❌ Could not get direct download link." });
      }
    } catch (e) {
      await sendForwarded(sock, m.key.remoteJid, { text: "❌ Failed to get Google Drive file." });
    }
  }
};