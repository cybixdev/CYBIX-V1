const axios = require('axios');
module.exports = {
  command: 'lyrics',
  handler: async (ctx, sendBanner) => {
    const song = ctx.message.text.split(' ').slice(1).join(' ');
    if (!song) return sendBanner(ctx, 'Usage: .lyrics <song name>');
    try {
      // Using lyrics.ovh API
      const [artist, ...rest] = song.split(' ');
      const title = rest.join(' ');
      const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
      await sendBanner(ctx, `*Lyrics:*\n${res.data.lyrics || 'Not found.'}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch lyrics.');
    }
  }
};