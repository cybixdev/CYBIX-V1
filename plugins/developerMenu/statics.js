module.exports = (bot, { BANNER, CHANNEL_BUTTONS, OWNER_ID }) => {
  bot.hears(/^\.statics$/i, async ctx => {
    if (`${ctx.from.id}` !== `${OWNER_ID}`) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Only the owner can use this command.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    await ctx.replyWithPhoto(BANNER, {
      caption: `📊 *Statics*\n- Total Plugins:  ${Object.keys(require.cache).length}\n- Platform: ${process.platform}`,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};