const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.mixtral|\/mixtral)\s+([\s\S]+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://mixtral-api.vercel.app/api/mixtral?question=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🌀 Mixtral\n\n${res.data.answer || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Mixtral API error.');
    }
  });
};