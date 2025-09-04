const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.truth|\/truth)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.truthordarebot.xyz/v1/truth');
      if (res.data && res.data.question) {
        await sendBanner(ctx, `🧐 Truth\n\n${res.data.question}`);
      } else {
        await sendBanner(ctx, '🚫 No truth found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch truth.');
    }
  });
};