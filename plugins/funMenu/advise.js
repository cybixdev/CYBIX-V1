const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.advice|\/advice)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.adviceslip.com/advice');
      if (res.data && res.data.slip && res.data.slip.advice) {
        await sendBanner(ctx, `📝 Advice\n\n${res.data.slip.advice}`);
      } else {
        await sendBanner(ctx, '🚫 No advice found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch advice.');
    }
  });
};