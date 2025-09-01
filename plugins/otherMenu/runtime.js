module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.runtime$/i, async ctx => {
    const sec = process.uptime() | 0;
    const [h, m, s] = [
      Math.floor(sec / 3600),
      Math.floor((sec % 3600) / 60),
      sec % 60
    ];
    await ctx.replyWithPhoto(BANNER, {
      caption: `🕒 Bot Uptime: ${h}h ${m}m ${s}s`,
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};