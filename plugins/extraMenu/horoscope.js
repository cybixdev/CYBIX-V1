const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.horoscope|\/horoscope)\s+([\s\S]+)/i, async (ctx) => {
    const sign = ctx.match[2].trim().toLowerCase();
    try {
      const res = await axios.get(`https://ohmanda.com/api/horoscope/${sign}`);
      if (res.data && res.data.horoscope) {
        await sendBanner(ctx, `🔮 Horoscope for ${sign}\n\n${res.data.horoscope}`);
      } else {
        await sendBanner(ctx, '🚫 No horoscope found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch horoscope.');
    }
  });
};