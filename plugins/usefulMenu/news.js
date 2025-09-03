const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('news', async ctx => {
    try {
      const res = await fetch('https://api.currentsapi.com/latest-news?apiKey=demo');
      const json = await res.json();
      if (json.news && json.news.length > 0) {
        ctx.reply(json.news[0].title + '\n' + json.news[0].url);
      } else {
        ctx.reply('No news found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};