const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('crypto', async ctx => {
    const symbol = ctx.message.text.replace('/crypto', '').trim();
    if (!symbol) return ctx.reply('Usage: /crypto <symbol>');
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
      const json = await res.json();
      ctx.reply(`${symbol}: $${json[symbol]?.usd || 'N/A'}`);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};