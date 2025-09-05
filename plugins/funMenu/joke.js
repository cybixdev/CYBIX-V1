const axios = require('axios');
module.exports = {
  command: 'joke',
  handler: async (ctx, sendBanner) => {
    try {
      const res = await axios.get('https://api.princetechn.com/api/fun/joke?apikey=prince');
      await sendBanner(ctx, `*Joke:*\n${res.data.result || res.data.joke || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch a joke.');
    }
  }
};