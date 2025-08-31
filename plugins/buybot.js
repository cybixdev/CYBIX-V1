module.exports = (bot, sendBannerAndButtons) => {
  bot.command('buybot', async ctx => {
    await sendBannerAndButtons(ctx, `🛒 Buy this bot: DM @cybixdev`);
  });
};