module.exports = {
  command: 'logs',
  handler: async (ctx, sendBanner) => {
    await sendBanner(ctx, 'Logs: Feature not implemented.');
  }
};