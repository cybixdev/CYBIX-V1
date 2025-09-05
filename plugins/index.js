const fs = require('fs');
const path = require('path');

function loadPlugins(bot, config) {
  const pluginsPath = path.join(__dirname);
  if (!fs.existsSync(pluginsPath)) return;
  fs.readdirSync(pluginsPath).forEach((folder) => {
    const pluginDir = path.join(pluginsPath, folder);
    if (fs.lstatSync(pluginDir).isDirectory()) {
      fs.readdirSync(pluginDir).forEach((file) => {
        if (file.endsWith('.js')) {
          const plugin = require(path.join(pluginDir, file));
          if (typeof plugin === 'function') plugin(bot, config);
        }
      });
    }
  });
}

module.exports = { loadPlugins };