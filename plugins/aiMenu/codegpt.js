const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('codegpt', async (ctx) => {
    const q = ctx.message.text.replace(/^\.codegpt\s*/, '') || 'Explain recursion';
    try {
      const res = await axios.get(`https://codegpt-api.vercel.app/api/codegpt?question=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `💻 CodeGPT\n\n${res.data.answer || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch CodeGPT response.');
    }
  });
};