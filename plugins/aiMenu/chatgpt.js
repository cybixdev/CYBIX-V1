const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('chatgpt', async ctx => {
    const prompt = ctx.message.text.replace('/chatgpt', '').trim();
    if (!prompt) return ctx.reply('Usage: /chatgpt <your question>');
    try {
      const res = await fetch(`https://chatgpt-api.shn.hk/v1/?q=${encodeURIComponent(prompt)}`);
      const json = await res.json();
      ctx.reply(json?.answer || 'No response.');
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};