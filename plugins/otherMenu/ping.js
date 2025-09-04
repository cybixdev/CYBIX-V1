module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.ping|\/ping)$/i, async (ctx) => {
    const start = Date.now();
    const sent = await ctx.reply('🏓 Pinging...');
    const ms = Date.now() - start;
    await sendBanner(ctx, `🏓 Pong!\n\nResponse time: ${ms} ms`);
    await bot.telegram.deleteMessage(ctx.chat.id, sent.message_id);
  });
};