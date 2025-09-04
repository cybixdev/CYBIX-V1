const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.suno|\/suno)\s+([\s\S]+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://suno-api.vercel.app/api/suno?question=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🎤 Suno\n\n${res.data.answer || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Suno API error.');
    }
  });
};