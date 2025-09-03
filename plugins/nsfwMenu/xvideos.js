const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('xvideos', async ctx => {
    const q = ctx.message.text.replace('/xvideos', '').trim();
    if (!q) return ctx.reply('Usage: /xvideos <search term>');
    try {
      const res = await fetch(`https://api.xvideos.red/api/search/videos?query=${encodeURIComponent(q)}&limit=1`);
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