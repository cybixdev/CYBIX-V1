const axios = require('axios');
module.exports = {
  command: 'docdl',
  handler: async (ctx, sendBanner) => {
    const url = ctx.message.text.split(' ').slice(1).join(' ');
    if (!url) return sendBanner(ctx, 'Usage: .docdl <document url>');
    try {
      // Using public API: docDownloader (third-party)
      const res = await axios.get(`https://api.docdownloader.com/download?url=${encodeURIComponent(url)}`);
      await sendBanner(ctx, `*DocDL:*\n${res.data.result || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch document.');
    }
  }
};