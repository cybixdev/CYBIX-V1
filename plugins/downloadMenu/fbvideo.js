const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('fbvideo', async (ctx) => {
    const q = ctx.message.text.replace(/^\.fbvideo\s*/, '').trim();
    if (!q || !/^https?:\/\/(www\.)?facebook\.com\//.test(q)) {
      await sendBanner(ctx, '❗ Usage: .fbvideo <facebook video url>');
      return;
    }
    try {
      const res = await axios.get(`https://api.akuari.my.id/downloader/fbdl?link=${encodeURIComponent(q)}`);
      if (res.data && res.data.result && res.data.result.length) {
        for (const media of res.data.result) {
          await ctx.replyWithVideo({ url: media.url });
        }
      } else {
        await sendBanner(ctx, '🚫 No Facebook video found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Facebook video.');
    }
  });
};