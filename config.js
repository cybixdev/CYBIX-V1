const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'data.json');
const DEFAULTS = {
  prefix: ['.', '/'],
  botName: 'CYBIX V1',
  banner: 'https://files.catbox.moe/2x9p8j.jpg',
  version: '1.3.0'
};

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return { ...DEFAULTS };
  try {
    const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    return { ...DEFAULTS, ...data };
  } catch {
    return { ...DEFAULTS };
  }
}

function writeConfig(newData) {
  const data = readConfig();
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ ...data, ...newData }, null, 2));
}

module.exports = {
  readConfig,
  writeConfig,
  CONFIG_PATH,
  DEFAULTS
};