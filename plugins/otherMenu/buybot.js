module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.buybot|\/buybot)$/i, async (ctx) => {
    await sendBanner(ctx, `💸 To buy this bot, contact @cybixdev or visit the official Telegram channel.\n\n[Click here](https://t.me/cybixtech)`);
  });
};