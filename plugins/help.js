module.exports = (bot, sendBannerAndButtons) => {
  bot.command('help', async ctx => {
    await sendBannerAndButtons(ctx, `ℹ️ For  help, use /menu `);
  });
};