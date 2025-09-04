module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.profile|\/profile)$/i, async (ctx) => {
    const user = ctx.from.username ? '@' + ctx.from.username : ctx.from.first_name;
    await sendBanner(ctx, `👤 Your Profile\n\nUsername: ${user}\nID: ${ctx.from.id}`);
  });
};