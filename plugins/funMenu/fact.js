const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.fact|\/fact)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      if (res.data && res.data.text) {
        await sendBanner(ctx, `🧠 Fact\n\n${res.data.text}`);
      } else {
        await sendBanner(ctx, '🚫 No fact found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch fact.');
    }
  });
};