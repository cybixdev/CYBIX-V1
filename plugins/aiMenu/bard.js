const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('bard', async (ctx) => {
    const q = ctx.message.text.replace(/^\.bard\s*/, '') || 'Hi';
    try {
      const res = await axios.get(`https://bardapi.dev/api?q=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🎵 Bard\n\n${res.data.response || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Bard response.');
    }
  });
};