const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('currency', async ctx => {
    const code = ctx.message.text.replace('/currency', '').trim();
    if (!code) return ctx.reply('Usage: /currency <currency code>');
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${code}`);
      const json = await res.json();
      if (json.rates) {
        ctx.reply(`USD: ${json.rates.USD}`);
      } else {
        ctx.reply('No currency data found.');
      }
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};