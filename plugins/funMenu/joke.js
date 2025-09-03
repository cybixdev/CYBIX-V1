const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('joke', async ctx => {
    try {
      const res = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
      const json = await res.json();
      ctx.reply(json.joke);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};