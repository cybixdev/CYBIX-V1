const axios = require('axios');
module.exports = {
  command: 'dl-xnxxvid',
  handler: async (ctx, sendBanner) => {
    const url = ctx.message.text.split(' ').slice(1).join(' ');
    if (!url) return sendBanner(ctx, 'Usage: .dl-xnxxvid <xnxx url>');
    try {
      // Using public xnxx video download API (third-party)
      const res = await axios.get(`https://api.fikri.workers.dev/xnxx/video?url=${encodeURIComponent(url)}`);
      await sendBanner(ctx, `*XNXX Download:*\n${res.data.url || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to download XNXX video.');
    }
  }
};