module.exports = (bot) => {
  bot.command('killall', async ctx => {
    ctx.reply('Bot will now exit.');
    process.exit(0);
  });
};