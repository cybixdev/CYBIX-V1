const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('pornhub', async ctx => {
    const q = ctx.message.text.replace('/pornhub', '').trim();
    if (!q) return ctx.reply('Usage: /pornhub <search term>');
    try {
      const res = await fetch(`https://api.pornhub.com/search/videos?query=${encodeURIComponent(q)}&limit=1`);
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