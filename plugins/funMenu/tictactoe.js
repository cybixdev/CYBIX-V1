module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.tictactoe$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: "🎮 *TicTacToe*\nSend .tictactoe <your move> (e.g. .tictactoe A1)\n(Feature coming soon!)",
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};