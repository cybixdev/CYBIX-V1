const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.math|\/math)\s+([\s\S]+)/i, async (ctx) => {
    const expr = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(expr)}`);
      if (typeof res.data === "string" || typeof res.data === "number") {
        await sendBanner(ctx, `🧮 Math\n\n${expr} = ${res.data}`);
      } else {
        await sendBanner(ctx, '🚫 No result.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to calculate.');
    }
  });
};