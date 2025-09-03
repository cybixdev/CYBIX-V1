const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('suno', async (ctx) => {
    const q = ctx.message.text.replace(/^\.suno\s*/, '') || 'Sing me a song';
    try {
      const res = await axios.get(`https://suno-api.vercel.app/api/suno?question=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🎤 Suno\n\n${res.data.answer || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Suno response.');
    }
  });
};