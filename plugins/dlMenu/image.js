const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('image', async ctx => {
    const q = ctx.message.text.replace('/image', '').trim();
    if (!q) return ctx.reply('Usage: /image <search term>');
    try {
      const res = await fetch(`https://api.waifu.pics/sfw/waifu`);
      const json = await res.json();
      ctx.replyWithPhoto(json.url);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};