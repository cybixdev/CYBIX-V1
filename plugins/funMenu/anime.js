const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('anime', async ctx => {
    const q = ctx.message.text.replace('/anime', '').trim();
    if (!q) return ctx.reply('Usage: /anime <search term>');
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=1`);
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        ctx.reply(json.data[0].title + '\n' + json.data[0].url);
      } else {
        ctx.reply('No anime found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};