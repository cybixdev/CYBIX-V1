const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('rule34', async ctx => {
    const q = ctx.message.text.replace('/rule34', '').trim();
    if (!q) return ctx.reply('Usage: /rule34 <tag>');
    try {
      const res = await fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(q)}&limit=1&json=1`);
      const json = await res.json();
      if (json && json.length > 0) {
        ctx.replyWithPhoto(json[0].file_url);
      } else {
        ctx.reply('No result found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};