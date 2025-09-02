const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('yts', async ctx => {
    const q = ctx.message.text.replace('/yts', '').trim();
    if (!q) return ctx.reply('Usage: /yts <movie name>');
    try {
      const res = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.data.movies && json.data.movies.length > 0) {
        ctx.reply(`YTS: ${json.data.movies[0].title}\n${json.data.movies[0].url}`);
      } else {
        ctx.reply('No movie found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};