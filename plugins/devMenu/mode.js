module.exports = {
  command: 'mode',
  handler: async (ctx, sendBanner) => {
    await sendBanner(ctx, 'Mode: Production');
  }
};