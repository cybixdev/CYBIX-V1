const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('apk', async (ctx) => {
    const q = ctx.message.text.replace(/^\.apk\s*/, '') || 'whatsapp';
    try {
      const res = await axios.get(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(q)}`);
      if (res.data && res.data.url) {
        await ctx.replyWithDocument({ url: res.data.url }, { caption: `📦 APK for ${q}` });
      } else {
        await sendBanner(ctx, '🚫 No APK found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch APK.');
    }
  });
};