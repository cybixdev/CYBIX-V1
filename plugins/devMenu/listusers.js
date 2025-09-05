module.exports = {
  command: 'listusers',
  handler: async (ctx, sendBanner) => {
    const users = require('../../index').users ? require('../../index').users : new Set();
    await sendBanner(ctx, `*User IDs:*\n${[...users].join('\n') || 'No users yet.'}`);
  }
};