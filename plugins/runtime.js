module.exports = (bot, sendBannerAndButtons) => {
  bot.command('runtime', async ctx => {
    const uptime = process.uptime();
    const min = Math.floor(uptime / 60);
    const sec = Math.floor(uptime % 60);
    await sendBannerAndButtons(ctx, `⏱️ Bot Uptime: ${min}m ${sec}s`);
  });
};