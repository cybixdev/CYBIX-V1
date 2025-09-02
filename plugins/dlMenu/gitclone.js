module.exports = (bot) => {
  bot.command('gitclone', async ctx => {
    const url = ctx.message.text.replace('/gitclone', '').trim();
    if (!url) return ctx.reply('Usage: /gitclone <GitHub repo URL>');
    ctx.reply(`To clone: git clone ${url}`);
  });
};