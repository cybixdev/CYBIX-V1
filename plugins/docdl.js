module.exports = (bot, sendBannerAndButtons) => {
  bot.command('docdl', async ctx => {
    const url = ctx.message.text.replace(/\/docdl\s?/i, '').trim();
    if (!url || !url.startsWith('http')) return ctx.reply('Usage: /docdl <document url>');
    await sendBannerAndButtons(ctx, `📄 Document Download:\n${url}`);
  });
};