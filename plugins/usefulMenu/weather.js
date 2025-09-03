const fetch = require('node-fetch');
module.exports = (bot) => {
  bot.command('weather', async ctx => {
    const city = ctx.message.text.replace('/weather', '').trim();
    if (!city) return ctx.reply('Usage: /weather <city>');
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3`);
      const weather = await res.text();
      ctx.reply(weather);
    } catch (e) {
      ctx.reply('Error: ' + e.message);
    }
  });
};