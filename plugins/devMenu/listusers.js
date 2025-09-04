module.exports = (bot, sendBanner, OWNER_ID) => {
  bot.hears(/^(\.listusers|\/listusers)$/i, async (ctx) => {
    if (String(ctx.from.id) !== OWNER_ID) {
      await sendBanner(ctx, "🚫 Only the owner can view users.");
      return;
    }
    // For demo, use chats.json to list chat IDs (groups/users)
    let chats = [];
    if (require('fs').existsSync('./chats.json')) {
      chats = JSON.parse(require('fs').readFileSync('./chats.json'));
    }
    await sendBanner(ctx, `👥 Users/Chats\n\n${chats.map((c) => `• \`${c}\``).join('\n') || 'No users yet.'}`);
  });
};