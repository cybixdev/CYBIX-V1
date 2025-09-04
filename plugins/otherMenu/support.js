module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.support|\/support)$/i, async (ctx) => {
    await sendBanner(ctx, `🛠️ Support\n\nFor support, join the [Telegram Channel](https://t.me/cybixtech) or contact @cybixdev.`);
  });
};