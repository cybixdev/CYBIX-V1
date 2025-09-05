module.exports = {
  command: 'developer',
  handler: async (ctx, sendBanner) => {
    await sendBanner(ctx, `*Developer:*Jaden Afrix`);
  }
};