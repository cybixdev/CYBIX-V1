module.exports = (bot, { BANNER, CHANNEL_BUTTONS, OWNER_ID }) => {
  bot.hears(/^\.listusers$/i, async ctx => {
    if (`${ctx.from.id}` !== `${OWNER_ID}`) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Only the owner can use this command.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    // Demo: Just show requesting user's info (expand with a real DB for full user list)
    await ctx.replyWithPhoto(BANNER, {
      caption: `👤 *User List*\n- ${ctx.from.username || ctx.from.first_name} (${ctx.from.id})`,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};