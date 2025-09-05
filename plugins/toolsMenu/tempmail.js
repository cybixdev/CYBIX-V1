const axios = require('axios');
module.exports = {
  command: 'tempmail',
  handler: async (ctx, sendBanner) => {
    try {
      // Using public temp-mail API
      const res = await axios.get('https://api.internal.temp-mail.io/api/v3/email/new');
      await sendBanner(ctx, `*TempMail:*\n${res.data.email || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to generate temp mail.');
    }
  }
};