module.exports = (bot, sendBannerAndButtons, OWNER_ID) => {
  bot.command('mode', async ctx => {
    if (String(ctx.from.id) !== String(OWNER_ID)) return ctx.reply('❌ Only the owner!');
    await sendBannerAndButtons(ctx, `🔧 Mode switched!`);
  });
};