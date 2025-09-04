module.exports = (bot, sendBanner, OWNER_ID) => {
  bot.hears(/^(\.mode|\/mode)\s*(\w+)?/i, async (ctx) => {
    if (String(ctx.from.id) !== OWNER_ID) {
      await sendBanner(ctx, "🚫 Only the owner can change bot mode.");
      return;
    }
    let mode = ctx.match[2] ? ctx.match[2].trim() : "show";
    // You can expand this with real modes (public/self/private etc)
    await sendBanner(ctx, `🛠️ Bot Mode: ${mode}`);
  });
};