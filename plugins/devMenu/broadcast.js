module.exports = (bot, sendBanner, OWNER_ID) => {
  bot.hears(/^(\.broadcast|\/broadcast)\s+([\s\S]+)/i, async (ctx) => {
    if (String(ctx.from.id) !== OWNER_ID) {
      await sendBanner(ctx, "🚫 Only the owner can broadcast.");
      return;
    }
    const message = ctx.match[2].trim();
    try {
      // Get all chats from the bot's context (this example assumes group chats are stored)
      // For production, you need a proper database or file to keep chat IDs.
      const chatFile = './chats.json';
      let chats = [];
      if (require('fs').existsSync(chatFile)) {
        chats = JSON.parse(require('fs').readFileSync(chatFile));
      }
      for (const chat of chats) {
        try {
          await bot.telegram.sendMessage(chat, `📢 Broadcast:\n\n${message}`);
        } catch {}
      }
      await sendBanner(ctx, "✅ Broadcast sent.");
    } catch (e) {
      await sendBanner(ctx, "🚫 Broadcast failed.");
    }
  });
  
  // Save chat ID on any message for broadcast feature
  bot.on('message', async (ctx) => {
    const chatFile = './chats.json';
    let chats = [];
    if (require('fs').existsSync(chatFile)) {
      chats = JSON.parse(require('fs').readFileSync(chatFile));
    }
    if (!chats.includes(ctx.chat.id)) {
      chats.push(ctx.chat.id);
      require('fs').writeFileSync(chatFile, JSON.stringify(chats));
    }
  });
};