const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('nsfwgif', async ctx => {
    try {
      const res = await fetch('https://nekos.life/api/v2/img/nsfw_neko_gif');
      const json = await res.json();
      ctx.replyWithAnimation(json.url);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};