const axios = require('axios');
module.exports = {
  command: 'ytmp4',
  handler: async (ctx, sendBanner) => {
    const url = ctx.message.text.split(' ').slice(1).join(' ');
    if (!url) return sendBanner(ctx, 'Usage: .ytmp4 <youtube url>');
    try {
      // Using public yt-dlp API
      const res = await axios.get(`https://api.vevioz.com/api/button/mp4?url=${encodeURIComponent(url)}`);
      await sendBanner(ctx, `*YouTube MP4:*\n${res.data.result || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch YouTube video.');
    }
  }
};