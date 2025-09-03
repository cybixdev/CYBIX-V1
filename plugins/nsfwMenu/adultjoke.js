const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('adultjoke', async (ctx) => {
    try {
      const res = await axios.get('https://api.api-ninjas.com/v1/jokes?limit=1', {
        headers: { 'X-Api-Key': 'YOUR_API_NINJAS_KEY' } // Replace with a free key or use another API
      });
      await sendBanner(ctx, `😏 Adult Joke\n\n${res.data[0].joke || 'No joke found.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch adult joke.');
    }
  });
};