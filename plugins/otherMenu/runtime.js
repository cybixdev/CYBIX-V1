module.exports = {
  command: 'runtime',
  handler: async (ctx, sendBanner) => {
    const startTime = require('../../index').startTime || Date.now();
    function uptimeStr(ms) {
      let s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      return `${h}h ${m}m ${sec}s`;
    }
    await sendBanner(ctx, `*Bot Uptime:*\n${uptimeStr(Date.now() - startTime)}`);
  }
};