const fs = require("fs-extra");
const path = require("path");

function loadPlugins(pluginsDir) {
  const plugins = {};
  let loaded = 0;
  if (!fs.existsSync(pluginsDir)) return { plugins, loaded: 0 };
  fs.readdirSync(pluginsDir).forEach(category => {
    const categoryPath = path.join(pluginsDir, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      fs.readdirSync(categoryPath).forEach(file => {
        if (file.endsWith(".js")) {
          try {
            delete require.cache[require.resolve(path.join(categoryPath, file))];
            const plugin = require(path.join(categoryPath, file));
            if (plugin && plugin.command && typeof plugin.run === "function") {
              plugins[plugin.command] = plugin.run;
              loaded++;
            }
          } catch (e) {}
        }
      });
    }
  });
  return { plugins, loaded };
}

module.exports = { loadPlugins };