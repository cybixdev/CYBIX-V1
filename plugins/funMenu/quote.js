const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.quote|\/quote)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.quotable.io/random');
      if (res.data && res.data.content) {
        await sendBanner(ctx, `💬 Quote\n\n"${res.data.content}"\n— ${res.data.author}`);
      } else {
        await sendBanner(ctx, '🚫 No quote found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch quote.');
    }
  });
};