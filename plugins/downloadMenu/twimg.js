const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.twimg|\/twimg)\s+(.+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    if (!/^https?:\/\/(www\.)?twitter\.com\//.test(q)) {
      await sendBanner(ctx, '❗ Usage: .twimg <twitter post url>');
      return;
    }
    try {
      const res = await axios.get(`https://api.lolhuman.xyz/api/twitter?apikey=demo&url=${encodeURIComponent(q)}`);
      if (res.data && res.data.result && res.data.result.media_url) {
        await ctx.replyWithPhoto({ url: res.data.result.media_url }, { caption: '🐦 Twitter Image' });
      } else {
        await sendBanner(ctx, '🚫 No Twitter media found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Twitter media.');
    }
  });
};