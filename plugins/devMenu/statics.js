module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.statics|\/statics)$/i, async (ctx) => {
    const mem = process.memoryUsage();
    await sendBanner(ctx, `📊 Bot Statics\n\nRSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB\nHeap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB\nHeap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB\nExternal: ${(mem.external / 1024 / 1024).toFixed(2)} MB`);
  });
};