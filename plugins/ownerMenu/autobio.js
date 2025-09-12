const { sendForwarded } = require("../../libs/forwarded");
const { loadSettings } = require("../../settings");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  command: ".autobio",
  run: async (sock, m, args) => {
    const settingsPath = path.resolve(__dirname, "../../settings/settings.json");
    const settings = loadSettings();
    if (!args.length) {
      return sendForwarded(sock, m.key.remoteJid, { text: "❌ Usage: .autobio <new bio text>" });
    }
    const newBio = args.join(" ");
    try {
      await sock.updateProfileStatus(newBio);
      settings.autobio = true;
      fs.writeJsonSync(settingsPath, settings, { spaces: 2 });
      global.settings = settings;
      await sendForwarded(sock, m.key.remoteJid, { text: "📝 Bio updated successfully!" });
    } catch (e) {
      await sendForwarded(sock, m.key.remoteJid, { text: "❌ Failed to update bio." });
    }
  }
};