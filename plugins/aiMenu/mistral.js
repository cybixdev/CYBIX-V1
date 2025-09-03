const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('mistral', async (ctx) => {
    const q = ctx.message.text.replace(/^\.mistral\s*/, '') || 'Hello';
    try {
      const res = await axios.get(`https://mistral-api.vercel.app/api/mistral?question=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🌬️ Mistral\n\n${res.data.answer || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Mistral response.');
    }
  });
};