const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('play', async ctx => {
    const q = ctx.message.text.replace('/play', '').trim();
    if (!q) return ctx.reply('Usage: /play <song name>');
    try {
      const res = await fetch(`https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(q)}&client_id=YOUR_SOUNDCLOUD_CLIENT_ID`);
      const json = await res.json();
      if (json.collection && json.collection.length > 0) {
        ctx.reply(`SoundCloud: ${json.collection[0].title}\n${json.collection[0].permalink_url}`);
      } else {
        ctx.reply('No track found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};