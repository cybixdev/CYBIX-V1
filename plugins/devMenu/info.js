module.exports = {
  command: 'info',
  handler: async (ctx, sendBanner) => {
    const botName = require('../../index').botName || 'CYBIX V1';
    const owner = process.env.OWNER_ID || 'Unknown';
    const prefix = require('../../index').prefix || ['.', '/'];
    const version = require('../../package.json').version;
    await sendBanner(ctx, `*Bot Info:*\nBot Name: ${botName}\nOwner: ${owner}\nPrefix: ${prefix.join(', ')}\nVersion: ${version}`);
  }
};