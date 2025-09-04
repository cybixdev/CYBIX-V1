module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.changelog|\/changelog)$/i, async (ctx) => {
    await sendBanner(ctx, `📜 Changelog\n\n- More features coming soon!`);
  });
};