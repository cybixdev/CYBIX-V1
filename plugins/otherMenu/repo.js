module.exports = function(bot, config) {
  bot.command('repo', async ctx => {
    await ctx.replyWithPhoto(
      await config.getBanner(),
      {
        caption: `🔗 Repo: NOT AVAILABLE`,
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