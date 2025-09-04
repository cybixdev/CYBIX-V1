const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.instadl|\/instadl)\s+(.+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    if (!/^https?:\/\/(www\.)?instagram\.com\//.test(q)) {
      await sendBanner(ctx, '❗ Usage: .instadl <instagram post url>');
      return;
    }
    try {
      const res = await axios.get(`https://api.lolhuman.xyz/api/instagram?apikey=demo&url=${encodeURIComponent(q)}`);
      if (res.data && res.data.result && res.data.result.media && res.data.result.media.length) {
        for (const media of res.data.result.media) {
          if (media.type === "video") {
            await ctx.replyWithVideo({ url: media.url });
          } else {
            await ctx.replyWithPhoto({ url: media.url });
          }
        }
      } else {
        await sendBanner(ctx, '🚫 No Instagram media found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Instagram media.');
    }
  });
};