module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.repo|\/repo)$/i, async (ctx) => {
    await sendBanner(ctx, `📦 GitHub Repository\n\n[REPO URL](https://t.me/cybixtech`);
  });
};