const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('blackbox', async (ctx) => {
    const q = ctx.message.text.replace(/^\.blackbox\s*/, '') || 'hi';
    try {
      const res = await axios.get(`https://apis.davidcyriltech.my.id/blackbox?q=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🟦 Blackbox\n\n${res.data.result || res.data.response || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Blackbox response.');
    }
  });
};