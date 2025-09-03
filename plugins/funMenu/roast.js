const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('roast', async ctx => {
    try {
      const res = await fetch('https://insult.mattbas.org/api/insult');
      const roast = await res.text();
      ctx.reply(roast);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};