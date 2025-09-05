const axios = require('axios');
module.exports = {
  command: 'xvideosearch',
  handler: async (ctx, sendBanner) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ');
    if (!query) return sendBanner(ctx, 'Usage: .xvideosearch <search term>');
    try {
      // Using public xvideos search API (third-party)
      const res = await axios.get(`https://api.fikri.workers.dev/xvideos/search/${encodeURIComponent(query)}`);
      if (res.data && res.data.length) {
        await sendBanner(ctx, `*XVideos Search:*\n${res.data.slice(0, 3).map(v => `${v.title}\n${v.url}`).join('\n\n')}`);
      } else {
        await sendBanner(ctx, 'No results found.');
      }
    } catch (e) {
      await sendBanner(ctx, 'Failed to search XVideos.');
    }
  }
};