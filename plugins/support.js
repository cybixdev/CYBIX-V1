module.exports = (bot, sendBannerAndButtons) => {
  bot.command('support', async ctx => {
    await sendBannerAndButtons(ctx, `💬 Support: DM @cybixdev`);
  });
};