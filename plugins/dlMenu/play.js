const axios = require('axios');
module.exports = {
  command: 'play',
  handler: async (ctx, sendBanner) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ');
    if (!query) return sendBanner(ctx, 'Usage: .play <song name>');
    try {
      // Using public API: ytdl api
      const res = await axios.get(`https://api.ytplaymp3.com/search?query=${encodeURIComponent(query)}`);
      if (res.data && res.data.length) {
        await sendBanner(ctx, `*Play:*\n${res.data[0].title}\n${res.data[0].url}`);
      } else {
        await sendBanner(ctx, 'No results found.');
      }
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch song.');
    }
  }
};