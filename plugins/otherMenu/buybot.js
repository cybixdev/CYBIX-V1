module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.buybot$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "💸 *Buy this Bot*\nContact: @cybixdev\nOr join our channels for more info!",
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};