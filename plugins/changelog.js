module.exports = (bot, sendBannerAndButtons) => {
  bot.command('changelog', async ctx => {
    await sendBannerAndButtons(ctx, `📝 Changelog:\n- Initial release\n- All features live!`);
  });
};