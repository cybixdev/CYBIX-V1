module.exports = function(bot, config) {
  bot.command('runtime', async ctx => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    await ctx.replyWithPhoto(
      await config.getBanner(),
      {
        caption: `⏳ Runtime: ${hours}h ${minutes}m ${seconds}s`,
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