const axios = require('axios');
module.exports = {
  command: 'img2url',
  handler: async (ctx, sendBanner) => {
    const url = ctx.message.text.split(' ').slice(1).join(' ');
    if (!url) return sendBanner(ctx, 'Usage: .img2url <image_url>');
    try {
      // Using imgur upload API (anonymous)
      const res = await axios.post('https://api.imgur.com/3/image', {
        image: url,
        type: 'url'
      }, {
        headers: { Authorization: 'Client-ID 5463b1f1b3a5c32' }
      });
      await sendBanner(ctx, `*Img2Url:*\n${res.data.data.link}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to convert image to url.');
    }
  }
};