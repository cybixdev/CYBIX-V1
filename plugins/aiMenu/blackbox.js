const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('blackbox', async ctx => {
    const prompt = ctx.message.text.replace('/blackbox', '').trim();
    if (!prompt) return ctx.reply('Usage: /blackbox <your question/code>');
    try {
      const res = await fetch('https://www.blackbox.ai/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }]
        })
      });
      const json = await res.json();
      ctx.reply(json?.message || 'No response.');
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};