const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('waifu', async ctx => {
    try {
      const res = await fetch('https://api.waifu.pics/sfw/waifu');
      const json = await res.json();
      ctx.replyWithPhoto(json.url);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};