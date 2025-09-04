const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.animalfact|\/animalfact)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://some-random-api.com/animal/dog');
      if (res.data && res.data.fact) {
        await sendBanner(ctx, `🐾 Animal Fact\n\n${res.data.fact}`);
      } else {
        await sendBanner(ctx, '🚫 No animal fact found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch animal fact.');
    }
  });
};