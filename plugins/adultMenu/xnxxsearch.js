const axios = require('axios');
module.exports = {
  command: 'xnxxsearch',
  handler: async (ctx, sendBanner) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ');
    if (!query) return sendBanner(ctx, 'Usage: .xnxxsearch <search term>');
    try {
      // Using public xnxx search API (third-party)
      const res = await axios.get(`https://api.fikri.workers.dev/xnxx/search/${encodeURIComponent(query)}`);
      if (res.data && res.data.length) {
        await sendBanner(ctx, `*XNXX Search:*\n${res.data.slice(0, 3).map(v => `${v.title}\n${v.url}`).join('\n\n')}`);
      } else {
        await sendBanner(ctx, 'No results found.');
      }
    } catch (e) {
      await sendBanner(ctx, 'Failed to search XNXX.');
    }
  }
};