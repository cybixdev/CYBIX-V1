module.exports = (bot, { BANNER, CHANNEL_BUTTONS, OWNER_ID }) => {
  let currentMode = "public";
  bot.hears(/^\.mode\s+(public|private)$/i, async ctx => {
    if (`${ctx.from.id}` !== `${OWNER_ID}`) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Only the owner can use this command.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    currentMode = ctx.match[1];
    await ctx.replyWithPhoto(BANNER, {
      caption: `⚙️ Mode changed to: ${currentMode}`,
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
  bot.hears(/^\.mode$/i, async ctx => {
    await ctx.replyWithPhoto(BANNER, {
      caption: `Current Mode: ${currentMode}\nUse .mode public or .mode private to change.`,
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};