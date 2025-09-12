const fs = require("fs-extra");
const path = require("path");

function loadSettings() {
  const file = path.resolve(__dirname, "settings.json");
  if (!fs.existsSync(file)) {
    fs.writeJsonSync(file, {
      ownerNumber: ["263784262759"],
      signature: "Queen Zaya V1",
      prefix: ".",
      mode: "public"
    }, { spaces: 2 });
  }
  return fs.readJsonSync(file);
}

module.exports = { loadSettings };