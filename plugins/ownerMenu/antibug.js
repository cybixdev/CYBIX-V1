const { sendForwarded } = require("../../libs/forwarded");
const { loadSettings } = require("../../settings");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  command: ".antibug",
  run: async (sock, m) => {
    const settingsPath = path.resolve(__dirname, "../../settings/settings.json");
    const settings = loadSettings();
    settings.antibug = !settings.antibug;
    fs.writeJsonSync(settingsPath, settings, { spaces: 2 });
    global.settings = settings;
    await sendForwarded(sock, m.key.remoteJid, {
      text: `🦠 Antibug is now ${settings.antibug ? "ENABLED" : "DISABLED"}.`
    });
  }
};