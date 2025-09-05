const axios = require('axios');
module.exports = {
  command: 'truth',
  handler: async (ctx, sendBanner) => {
    try {
      const res = await axios.get('https://api.princetechn.com/api/fun/truth?apikey=prince');
      await sendBanner(ctx, `*Truth:*\n${res.data.result || res.data.truth || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch truth.');
    }
  }
};