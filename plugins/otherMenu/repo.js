module.exports = {
  command: 'repo',
  handler: async (ctx, sendBanner) => {
    await sendBanner(ctx, `*CYBIX V1 Official Repo:*\nNOT AVAILABLE`);
  }
};