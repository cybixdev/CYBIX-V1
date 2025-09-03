module.exports = (bot) => {
  bot.command('restart', async ctx => {
    ctx.reply('Restarting...');
    process.exit(1);
  });
};