const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('song', async ctx => {
    const q = ctx.message.text.replace('/song', '').trim();
    if (!q) return ctx.reply('Usage: /song <song name>');
    try {
      const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(q)}`);
      const json = await res.json();
      ctx.reply(json.lyrics || 'No lyrics found.');
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};