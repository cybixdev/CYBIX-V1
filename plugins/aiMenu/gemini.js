const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.gemini|\/gemini)\s+([\s\S]+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://gemini-api-psi.vercel.app/api/gemini?question=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🌟 Gemini\n\n${res.data.answer || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Gemini API error.');
    }
  });
};