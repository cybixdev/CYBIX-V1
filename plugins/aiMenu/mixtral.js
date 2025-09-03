const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('mixtral', async (ctx) => {
    const q = ctx.message.text.replace(/^\.mixtral\s*/, '') || 'Hello';
    try {
      const res = await axios.get(`https://mixtral-api.vercel.app/api/mixtral?question=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🌀 Mixtral\n\n${res.data.answer || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Mixtral response.');
    }
  });
};