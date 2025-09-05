module.exports = function(bot, config) {
  bot.command('ping', async ctx => {
    const start = Date.now();
    await ctx.reply('Pong!');
    const elapsed = Date.now() - start;
    await ctx.replyWithPhoto(
      await config.getBanner(),
      {
        caption: `🏓 Ping: ${elapsed}ms`,
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