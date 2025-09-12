const os = require("os");
const prettyMs = require("pretty-ms").default;
const moment = require("moment-timezone");

function getRAM() {
  const total = os.totalmem();
  const free = os.freemem();
  return {
    total: (total / 1024 / 1024 / 1024).toFixed(2) + " GB",
    free: (free / 1024 / 1024 / 1024).toFixed(2) + " GB",
    used: ((total - free) / 1024 / 1024 / 1024).toFixed(2) + " GB"
  };
}

function getSystemStats() {
  const uptime = prettyMs(os.uptime() * 1000, { verbose: true });
  return {
    platform: os.platform(),
    arch: os.arch(),
    node: process.version,
    uptime,
    cpu: os.cpus()[0]?.model || 'Unknown',
    cpus: os.cpus().length,
    ram: getRAM(),
    time: moment().tz("Africa/Harare").format("YYYY-MM-DD HH:mm:ss")
  };
}

module.exports = { getSystemStats };