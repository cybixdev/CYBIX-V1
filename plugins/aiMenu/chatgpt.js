const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('chatgpt', async (ctx) => {
    const q = ctx.message.text.replace(/^\.chatgpt\s*/, '') || 'Hello';
    try {
      const res = await axios.get(`https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🤖 ChatGPT\n\n${res.data.result || res.data.response || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch ChatGPT response.');
    }
  });
};