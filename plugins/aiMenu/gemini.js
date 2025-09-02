const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('gemini', async ctx => {
    const prompt = ctx.message.text.replace('/gemini', '').trim();
    if (!prompt) return ctx.reply('Usage: /gemini <your question>');
    try {
      const res = await fetch(`https://aigem.shn.hk/v1/?q=${encodeURIComponent(prompt)}`);
      const json = await res.json();
      ctx.reply(json?.answer || 'No response.');
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};