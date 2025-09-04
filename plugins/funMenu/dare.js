const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.dare|\/dare)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://api.truthordarebot.xyz/v1/dare');
      if (res.data && res.data.question) {
        await sendBanner(ctx, `😈 Dare\n\n${res.data.question}`);
      } else {
        await sendBanner(ctx, '🚫 No dare found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch dare.');
    }
  });
};