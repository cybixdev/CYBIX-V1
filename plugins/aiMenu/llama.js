const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('llama', async (ctx) => {
    const q = ctx.message.text.replace(/^\.llama\s*/, '') || 'Hello';
    try {
      const res = await axios.get(`https://api.llama-api.com/v1/text?query=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🦙 Llama\n\n${res.data.result || res.data.response || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Llama response.');
    }
  });
};