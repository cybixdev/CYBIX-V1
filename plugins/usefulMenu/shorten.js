const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('shorten', async ctx => {
    const url = ctx.message.text.replace('/shorten', '').trim();
    if (!url) return ctx.reply('Usage: /shorten <url>');
    try {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const shortUrl = await res.text();
      ctx.reply(shortUrl);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};