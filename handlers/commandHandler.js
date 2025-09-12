const { loadPlugins } = require("../libs/pluginLoader");
const { loadSettings } = require("../settings");
const { getSystemStats } = require("../libs/sysinfo");
const { sendForwarded } = require("../libs/forwarded");
const { bannerMenu } = require("../menu/banner");
const packageJson = require("../package.json");
const { bannerImage } = require("../config/bot");
const pluginsDir = require("path").resolve(__dirname, "..", "plugins");

async function handleCommand(sock, m) {
  const text = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
  const [cmd, ...args] = text.trim().split(/\s+/);
  const command = cmd.toLowerCase();
  const { plugins, loaded: pluginCount } = loadPlugins(pluginsDir);
  const settings = loadSettings();
  
  if (command === settings.prefix + "menu") {
    const stats = getSystemStats();
    const version = packageJson.version;
    const menuText = await bannerMenu(
      stats,
      pluginCount,
      version,
      settings.prefix,
      settings.mode
    );
    await sendForwarded(sock, m.key.remoteJid, {
      image: { url: bannerImage },
      caption: menuText
    });
    return;
  }
  if (plugins[command]) {
    await plugins[command](sock, m, args);
    return;
  }
}
module.exports = { handleCommand };