const { v4: uuidv4 } = require('uuid');
module.exports = (bot) => {
  bot.command('uuid', async ctx => {
    ctx.reply(uuidv4());
  });
};