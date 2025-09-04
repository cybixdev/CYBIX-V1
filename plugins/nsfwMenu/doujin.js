const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.doujin|\/doujin)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://hentai-api-rest.vercel.app/api/doujin');
      if (res.data && res.data.title && res.data.url) {
        await sendBanner(ctx, `🔞 Doujin Title: ${res.data.title}\n\nRead: ${res.data.url}`);
      } else {
        await sendBanner(ctx, '🚫 No doujin found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch doujin.');
    }
  });
};