const axios = require('axios');
module.exports = (bot, sendBanner) => {
  // Both /chatgpt and .chatgpt
  bot.hears(/^(\.chatgpt|\/chatgpt)\s+([\s\S]+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://api.chatgptfree.workers.dev/?msg=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🤖 ChatGPT\n\n${res.data.response || res.data.result || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 ChatGPT API error.');
    }
  });
};