module.exports = (bot, sendBannerAndButtons) => {
  bot.command('repo', async ctx => {
    await sendBannerAndButtons(ctx, `🔗 Repo: GO WRITE YOUR OWN CIDE B*7CH`);
  });
};