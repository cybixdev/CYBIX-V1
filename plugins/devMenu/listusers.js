module.exports = function(bot, config) {
  bot.command('listusers', async ctx => {
    try {
      const chatId = ctx.chat?.id;
      if (!chatId) return ctx.reply('No group context.');
      const membersCount = await bot.telegram.getChatMembersCount(chatId);
      await ctx.replyWithPhoto(
        await config.getBanner(),
        {
          caption: `👥 Total users in this chat: ${membersCount}`,
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Telegram Channel", url: "https://t.me/cybixtech" },
                { text: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" }
              ]
            ]
          }
        }
      );
    } catch (e) {
      await ctx.reply('Failed to fetch users.');
    }
  });
};