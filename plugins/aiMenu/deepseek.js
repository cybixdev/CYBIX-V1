const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.deepseek|\/deepseek)\s+([\s\S]+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://api.lolhuman.xyz/api/deepseek?apikey=demo&text=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🧠 DeepSeek\n\n${res.data.result || res.data.response || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 DeepSeek API error.');
    }
  });
};