const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('diss', async ctx => {
    try {
      const res = await fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json');
      const json = await res.json();
      ctx.reply(json.insult);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};