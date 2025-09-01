module.exports = (bot, { BANNER, CHANNEL_BUTTONS, OWNER_ID }) => {
  bot.hears(/^\.broadcast\s+(.+)/i, async ctx => {
    if (`${ctx.from.id}` !== `${OWNER_ID}`) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Only the owner can use this command.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    const text = ctx.match[1];
    // For demo: Just reply back instead of real broadcast
    await ctx.replyWithPhoto(BANNER, {
      caption: `📢 Broadcast message would be sent:\n${text}`,
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};