const { sendForwarded } = require("../../libs/forwarded");
const { getSystemStats } = require("../../libs/sysinfo");
const { bannerMenu } = require("../../menu/banner");
const { loadSettings } = require("../../settings");
const packageJson = require("../../package.json");
const { bannerImage } = require("../../config/bot");
const { loadPlugins } = require("../../libs/pluginLoader");
const path = require("path");

module.exports = {
  command: ".menu",
  run: async (sock, m) => {
    const stats = getSystemStats();
    const settings = loadSettings();
    const pluginsDir = path.resolve(__dirname, "..", "..", "plugins");
    const { loaded: pluginCount } = loadPlugins(pluginsDir);
    const menuText = await bannerMenu(
      stats,
      pluginCount,
      packageJson.version,
      settings.prefix,
      settings.mode
    );
    await sendForwarded(sock, m.key.remoteJid, {
      image: { url: bannerImage },
      caption: menuText
    });
  }
};