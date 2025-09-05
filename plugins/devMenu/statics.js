module.exports = function(bot, config) {
  bot.command('statics', async ctx => {
    const memory = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    await ctx.replyWithPhoto(
      await config.getBanner(),
      {
        caption: `🖥️ Bot Statics\n- Memory Usage: ${memory}\n- Uptime: ${hours}h ${minutes}m ${seconds}s`,
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Telegram Channel", url: "https://t.me/cybixtech" },
              { text: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" }
            ]
          ]
        }
      }
    );
  });
};