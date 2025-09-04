const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.bard|\/bard)\s+([\s\S]+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://bardapi.dev/api?q=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🎵 Bard\n\n${res.data.response || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Bard API error.');
    }
  });
};