module.exports = {
  command: 'statics',
  handler: async (ctx, sendBanner) => {
    const memory = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
    const users = require('../../index').users ? require('../../index').users.size : 0;
    const version = require('../../package.json').version;
    await sendBanner(ctx, `*Bot Statics:*\nVersion: ${version}\nMemory: ${memory}\nUsers: ${users}`);
  }
};