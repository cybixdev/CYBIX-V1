const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.mistral|\/mistral)\s+([\s\S]+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://mistral-api.vercel.app/api/mistral?question=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🌬️ Mistral\n\n${res.data.answer || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Mistral API error.');
    }
  });
};