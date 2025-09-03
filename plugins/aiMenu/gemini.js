const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('gemini', async (ctx) => {
    const q = ctx.message.text.replace(/^\.gemini\s*/, '') || 'Hello';
    try {
      const res = await axios.get(`https://gemini-api.vercel.app/api/gemini?question=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🌟 Gemini\n\n${res.data.answer || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Gemini response.');
    }
  });
};