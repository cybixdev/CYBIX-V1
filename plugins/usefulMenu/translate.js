const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('translate', async ctx => {
    const txt = ctx.message.text.replace('/translate', '').trim();
    if (!txt) return ctx.reply('Usage: /translate <text>');
    try {
      const res = await fetch(`https://translate.argosopentech.com/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: txt, source: "en", target: "es", format: "text" })
      });
      const json = await res.json();
      ctx.reply(json.translatedText || 'No translation.');
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};