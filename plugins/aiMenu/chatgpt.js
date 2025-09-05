const axios = require('axios');
module.exports = {
  command: 'chatgpt',
  handler: async (ctx, sendBanner) => {
    let query = ctx.message.text.split(' ').slice(1).join(' ');
    if (!query) return sendBanner(ctx, 'Usage: .chatgpt <your question>');
    try {
      const res = await axios.get(`https://api.princetechn.com/api/ai/gpt?apikey=prince&q=${encodeURIComponent(query)}`);
      await sendBanner(ctx, `*ChatGPT:*\n${res.data.result || res.data.response || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, `Failed to get response from ChatGPT API.`);
    }
  }
};