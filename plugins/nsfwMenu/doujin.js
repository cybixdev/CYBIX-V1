const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('doujin', async (ctx) => {
    try {
      const res = await axios.get('https://hentai-api.rest/api/doujin');
      await sendBanner(ctx, `🔞 Doujin Title: ${res.data.title}\n\nRead: ${res.data.url}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch doujin.');
    }
  });
};