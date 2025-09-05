const axios = require('axios');
module.exports = {
  command: 'fancy',
  handler: async (ctx, sendBanner) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    if (!text) return sendBanner(ctx, 'Usage: .fancy <text>');
    try {
      // Using princetechn API as you provided
      const res = await axios.get(`https://api.princetechn.com/api/tools/fancyfont?apikey=prince&text=${encodeURIComponent(text)}`);
      await sendBanner(ctx, `*Fancy Fonts:*\n${res.data.result || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to generate fancy fonts.');
    }
  }
};