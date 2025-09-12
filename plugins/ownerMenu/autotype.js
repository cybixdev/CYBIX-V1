const { sendForwarded } = require("../../libs/forwarded");
const { loadSettings } = require("../../settings");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  command: ".autotype",
  run: async (sock, m) => {
    const settingsPath = path.resolve(__dirname, "../../settings/settings.json");
    const settings = loadSettings();
    settings.autotype = !settings.autotype;
    fs.writeJsonSync(settingsPath, settings, { spaces: 2 });
    global.settings = settings;
    await sendForwarded(sock, m.key.remoteJid, {
      text: `⌨️ Autotype is now ${settings.autotype ? "ENABLED" : "DISABLED"}.`
    });
  }
};