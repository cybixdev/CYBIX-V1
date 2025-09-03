const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('waifu18', async ctx => {
    try {
      const res = await fetch('https://api.waifu.pics/nsfw/waifu');
      const json = await res.json();
      ctx.replyWithPhoto(json.url);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};