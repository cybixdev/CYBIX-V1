const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('japan18', async ctx => {
    try {
      const res = await fetch('https://api.xvideos.red/api/search/videos?query=japan18&limit=1');
      const json = await res.json();
      if (json.videos && json.videos.length > 0) {
        ctx.reply(json.videos[0].url || 'No video found.');
      } else {
        ctx.reply('No video found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};