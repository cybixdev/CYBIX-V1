const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('deepseek', async (ctx) => {
    const q = ctx.message.text.replace(/^\.deepseek\s*/, '') || 'Hi';
    try {
      const res = await axios.get(`https://apis.davidcyriltech.my.id/ai/deepseek-v3?text=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🧠 DeepSeek\n\n${res.data.result || res.data.response || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch DeepSeek response.');
    }
  });
};