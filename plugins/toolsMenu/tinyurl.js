const axios = require('axios');
module.exports = {
  command: 'tinyurl',
  handler: async (ctx, sendBanner) => {
    const longUrl = ctx.message.text.split(' ').slice(1).join(' ');
    if (!longUrl) return sendBanner(ctx, 'Usage: .tinyurl <url>');
    try {
      // Using TinyURL public API
      const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      await sendBanner(ctx, `*Short URL:*\n${res.data}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to shorten URL.');
    }
  }
};