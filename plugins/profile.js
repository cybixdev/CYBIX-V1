module.exports = (bot, sendBannerAndButtons) => {
  bot.command('profile', async ctx => {
    const user = ctx.from;
    await sendBannerAndButtons(ctx, `👤 Profile:\nID: ${user.id}\nUsername: @${user.username || 'none'}`);
  });
};