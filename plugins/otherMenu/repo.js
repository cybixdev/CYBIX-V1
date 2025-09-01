module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.repo$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "🗂️ *CYBIX V1 Repo*\nNOT AVAILABLE",
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};