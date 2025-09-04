const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.codegpt|\/codegpt)\s+([\s\S]+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://codegpt-api.vercel.app/api/codegpt?question=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `💻 CodeGPT\n\n${res.data.answer || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 CodeGPT API error.');
    }
  });
};