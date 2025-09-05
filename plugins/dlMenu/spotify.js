const axios = require('axios');
module.exports = {
  command: 'spotify',
  handler: async (ctx, sendBanner) => {
    const song = ctx.message.text.split(' ').slice(1).join(' ');
    if (!song) return sendBanner(ctx, 'Usage: .spotify <song name>');
    try {
      const res = await axios.get(`https://api.princetechn.com/api/dl/spotify?apikey=prince&q=${encodeURIComponent(song)}`);
      await sendBanner(ctx, `*Spotify Download:*\n${res.data.result || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch from Spotify.');
    }
  }
};