const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.wallpaper|\/wallpaper)\s+(.+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      // Unsplash API requires a key, use demo API for now
      const res = await axios.get(`https://api.lolhuman.xyz/api/wallpaper?apikey=demo&query=${encodeURIComponent(q)}`);
      if (res.data && res.data.result && res.data.result.url) {
        await ctx.replyWithPhoto({ url: res.data.result.url }, { caption: `🖼️ Wallpaper for ${q}` });
      } else {
        await sendBanner(ctx, '🚫 No wallpaper found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch wallpaper.');
    }
  });
};