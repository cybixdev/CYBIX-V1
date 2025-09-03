const os = require('os');
module.exports = (bot) => {
  bot.command('stats', async ctx => {
    ctx.reply(`Uptime: ${process.uptime().toFixed(0)}s\nRAM: ${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`);
  });
};