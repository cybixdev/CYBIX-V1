const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('apk', async ctx => {
    const q = ctx.message.text.replace('/apk', '').trim();
    if (!q) return ctx.reply('Usage: /apk <app name>');
    try {
      const res = await fetch(`https://apkpure.com/search?q=${encodeURIComponent(q)}`);
      const html = await res.text();
      const matches = html.match(/<a class="search-title" href="(.*?)">(.*?)<\/a>/);
      if (matches) {
        ctx.reply(`Top result: ${matches[2]} https://apkpure.com${matches[1]}`);
      } else {
        ctx.reply('No APK found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};