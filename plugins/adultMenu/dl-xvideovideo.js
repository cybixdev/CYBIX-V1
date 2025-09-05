const axios = require('axios');
module.exports = {
  command: 'dl-xvideovideo',
  handler: async (ctx, sendBanner) => {
    const url = ctx.message.text.split(' ').slice(1).join(' ');
    if (!url) return sendBanner(ctx, 'Usage: .dl-xvideovideo <xvideos url>');
    try {
      // Using public xvideos download API (third-party)
      const res = await axios.get(`https://api.fikri.workers.dev/xvideos/video?url=${encodeURIComponent(url)}`);
      await sendBanner(ctx, `*XVideos Download:*\n${res.data.url || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to download XVideos video.');
    }
  }
};