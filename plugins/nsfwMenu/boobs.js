const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('boobs', async ctx => {
    try {
      const res = await fetch('http://api.oboobs.ru/boobs/0/1/random');
      const json = await res.json();
      if (json && json.length > 0) {
        ctx.replyWithPhoto(`http://media.oboobs.ru/${json[0].preview}`);
      } else {
        ctx.reply('No result found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};