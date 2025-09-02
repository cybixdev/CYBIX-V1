const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('ytmp4', async ctx => {
    const url = ctx.message.text.replace('/ytmp4', '').trim();
    if (!url) return ctx.reply('Usage: /ytmp4 <YouTube URL>');
    try {
      const res = await fetch(`https://yt-download.org/api/widget/mp4/${encodeURIComponent(url)}`);
      const html = await res.text();
      const match = html.match(/href="(https:\/\/[^"]*\.mp4)"/);
      if (match) {
        ctx.reply(`Download MP4: ${match[1]}`);
      } else {
        ctx.reply('No download link found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};