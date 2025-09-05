const axios = require('axios');
module.exports = {
  command: 'mediafire',
  handler: async (ctx, sendBanner) => {
    const url = ctx.message.text.split(' ').slice(1).join(' ');
    if (!url) return sendBanner(ctx, 'Usage: .mediafire <mediafire url>');
    try {
      // Using princetechn API as provided
      const res = await axios.get(`https://api.princetechn.com/api/dl/mediafire?apikey=prince&url=${encodeURIComponent(url)}`);
      await sendBanner(ctx, `*Mediafire Download:*\n${res.data.result || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch from Mediafire.');
    }
  }
};