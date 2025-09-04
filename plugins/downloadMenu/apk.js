const axios = require('axios');
module.exports = (bot, sendBanner) => {
  // Accepts .apk or /apk query
  bot.hears(/^(\.apk|\/apk)\s+(.+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    try {
      // Use APKPure search API (no key required)
      const res = await axios.get(`https://d.apkpure.com/api/v2/search?q=${encodeURIComponent(q)}`);
      if (res.data && res.data.data && res.data.data.length > 0) {
        const app = res.data.data[0];
        await ctx.replyWithDocument({ url: app.apkurl }, { caption: `📦 APK for ${app.title}` });
      } else {
        await sendBanner(ctx, '🚫 No APK found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch APK.');
    }
  });
};