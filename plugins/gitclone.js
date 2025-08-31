module.exports = (bot, sendBannerAndButtons) => {
  bot.command('gitclone', async ctx => {
    const repo = ctx.message.text.replace(/\/gitclone\s?/i, '').trim();
    if (!repo || !repo.startsWith('https://github.com/')) return ctx.reply('Usage: /gitclone <github repo url>');
    await sendBannerAndButtons(ctx, `📂 GitHub Repo:\n${repo}/archive/refs/heads/main.zip`);
  });
};