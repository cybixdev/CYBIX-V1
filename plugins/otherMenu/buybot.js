module.exports = {
  command: 'buybot',
  handler: async (ctx, sendBanner) => {
    await sendBanner(ctx, `*Buy CYBIX Bot:*\nContact @cybixdev`);
  }
};