module.exports = (bot) => {
  bot.command('qr', async ctx => {
    const txt = ctx.message.text.replace('/qr', '').trim();
    if (!txt) return ctx.reply('Usage: /qr <text>');
    ctx.replyWithPhoto(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(txt)}`);
  });
};