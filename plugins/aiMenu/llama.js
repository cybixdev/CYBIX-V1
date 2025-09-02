const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('llama', async ctx => {
    const prompt = ctx.message.text.replace('/llama', '').trim();
    if (!prompt) return ctx.reply('Usage: /llama <your prompt>');
    try {
      const res = await fetch(`https://llama-api.shn.hk/v1/?q=${encodeURIComponent(prompt)}`);
      const json = await res.json();
      ctx.reply(json?.answer || 'No response from Llama.');
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};