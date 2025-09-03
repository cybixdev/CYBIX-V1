module.exports = (bot, sendBanner, config) => {
  bot.command('devinfo', async ctx => {
    ctx.reply(`Owner: ${config.ownerId}\nContact: ${config.developerContact}`);
  });
};