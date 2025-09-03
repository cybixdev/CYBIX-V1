const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('ass', async ctx => {
    try {
      const res = await fetch('http://api.obutts.ru/butts/0/1/random');
      const json = await res.json();
      if (json && json.length > 0) {
        ctx.replyWithPhoto(`http://media.obutts.ru/${json[0].preview}`);
      } else {
        ctx.reply('No result found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};