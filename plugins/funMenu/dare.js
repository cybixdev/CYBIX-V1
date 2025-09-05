const axios = require('axios');
module.exports = {
  command: 'dare',
  handler: async (ctx, sendBanner) => {
    try {
      const res = await axios.get('https://api.princetechn.com/api/fun/dare?apikey=prince');
      await sendBanner(ctx, `*Dare:*\n${res.data.result || res.data.dare || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch dare.');
    }
  }
};