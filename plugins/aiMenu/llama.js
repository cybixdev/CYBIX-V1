const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.llama|\/llama)\s+([\s\S]+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      const res = await axios.get(`https://api.lolhuman.xyz/api/llama?apikey=demo&text=${encodeURIComponent(q)}`);
      await sendBanner(ctx, `🦙 Llama\n\n${res.data.result || res.data.response || 'No response.'}`);
    } catch (e) {
      await sendBanner(ctx, '🚫 Llama API error.');
    }
  });
};