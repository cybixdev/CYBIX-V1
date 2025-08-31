module.exports = (bot, sendBannerAndButtons) => {
  bot.command('ping', async ctx => {
    await sendBannerAndButtons(ctx, `🏓 Pong!`);
  });
};