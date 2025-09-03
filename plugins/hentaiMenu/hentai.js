const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('hentai', async ctx => {
    try {
      const res = await fetch('https://nekos.life/api/v2/img/hentai');
      const json = await res.json();
      ctx.replyWithPhoto(json.url);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};