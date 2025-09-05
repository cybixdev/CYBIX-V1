const axios = require('axios');
module.exports = {
  command: 'deepseek',
  handler: async (ctx, sendBanner) => {
    let query = ctx.message.text.split(' ').slice(1).join(' ') || 'Whats Your Model';
    try {
      const res = await axios.get(`https://api.princetechn.com/api/ai/deepseek-v3?apikey=prince&q=${encodeURIComponent(query)}`);
      await sendBanner(ctx, `*DeepSeek:*\n${res.data.result || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, `Failed to get response from DeepSeek API.`);
    }
  }
};