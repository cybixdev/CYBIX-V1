const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('sextube', async ctx => {
    const q = ctx.message.text.replace('/sextube', '').trim();
    if (!q) return ctx.reply('Usage: /sextube <search term>');
    try {
      const res = await fetch(`https://api.sextube.com/search/videos?query=${encodeURIComponent(q)}&limit=1`);
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