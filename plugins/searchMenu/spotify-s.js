const axios = require('axios');
module.exports = {
  command: 'spotify-s',
  handler: async (ctx, sendBanner) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ');
    if (!query) return sendBanner(ctx, 'Usage: .spotify-s <track name>');
    try {
      // Using princetechn API as provided
      const res = await axios.get(`https://api.princetechn.com/api/search/spotify?apikey=prince&q=${encodeURIComponent(query)}`);
      await sendBanner(ctx, `*Spotify Search:*\n${res.data.result || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to search Spotify.');
    }
  }
};