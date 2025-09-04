module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.runtime|\/runtime)$/i, async (ctx) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    await sendBanner(ctx, `⏱️ Bot Runtime\n\nUp for: ${hours}h ${minutes}m ${seconds}s`);
  });
};