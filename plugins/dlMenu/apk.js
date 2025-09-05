const axios = require('axios');
module.exports = {
  command: 'apk',
  handler: async (ctx, sendBanner) => {
    const app = ctx.message.text.split(' ').slice(1).join(' ');
    if (!app) return sendBanner(ctx, 'Usage: .apk <app name>');
    try {
      const res = await axios.get(`https://api.princetechn.com/api/dl/apk?apikey=prince&q=${encodeURIComponent(app)}`);
      await sendBanner(ctx, `*APK Download:*\n${res.data.result || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch APK.');
    }
  }
};