module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.help|\/help)$/i, async (ctx) => {
    await sendBanner(ctx, `🆘 Help & Usage\n\nPrefix: . or /\nExample: .menu or /menu\nAll commands are shown in the menu. For more, visit [Telegram Channel](https://t.me/cybixtech)`);
  });
};