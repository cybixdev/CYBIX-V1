const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('meme', async ctx => {
    try {
      const res = await fetch('https://meme-api.com/gimme');
      const json = await res.json();
      ctx.replyWithPhoto(json.url);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};