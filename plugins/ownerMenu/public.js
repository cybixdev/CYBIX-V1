const { sendForwarded } = require("../../libs/forwarded");
const { loadSettings } = require("../../settings");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  command: ".public",
  run: async (sock, m) => {
    const settingsPath = path.resolve(__dirname, "../../settings/settings.json");
    const settings = loadSettings();
    settings.mode = "public";
    fs.writeJsonSync(settingsPath, settings, { spaces: 2 });
    global.settings = settings;
    await sendForwarded(sock, m.key.remoteJid, { text: "🌐 Bot mode set to PUBLIC. Everyone can use commands." });
  }
};