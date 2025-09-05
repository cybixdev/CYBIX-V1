const axios = require('axios');
module.exports = {
  command: 'gdrive',
  handler: async (ctx, sendBanner) => {
    const url = ctx.message.text.split(' ').slice(1).join(' ');
    if (!url) return sendBanner(ctx, 'Usage: .gdrive <gdrive url>');
    try {
      // Using princetechn API as provided
      const res = await axios.get(`https://api.princetechn.com/api/dl/gdrive?apikey=prince&url=${encodeURIComponent(url)}`);
      await sendBanner(ctx, `*GDrive Download:*\n${res.data.result || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch from GDrive.');
    }
  }
};