const axios = require('axios');
module.exports = {
  command: 'google',
  handler: async (ctx, sendBanner) => {
    const q = ctx.message.text.split(' ').slice(1).join(' ');
    if (!q) return sendBanner(ctx, 'Usage: .google <search term>');
    try {
      API(no, key ,needed)
      const res = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json`);
      await sendBanner(ctx, `*Google/DDG Search:*\n${res.data.Abstract || 'No results found.'}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to search.');
    }
  }
};