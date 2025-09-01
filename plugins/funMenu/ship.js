module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.ship\s+(.+)\s+(.+)/i, async ctx => {
    const a = ctx.match[1];
    const b = ctx.match[2];
    const percent = Math.floor(Math.random() * 51) + 50;
    await ctx.replyWithPhoto(BANNER, {
      caption: `💞 Ship Result\n${a} ❤ ${b}\nCompatibility: ${percent}%`,
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};