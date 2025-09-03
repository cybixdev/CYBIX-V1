const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('twimg', async (ctx) => {
    const q = ctx.message.text.replace(/^\.twimg\s*/, '').trim();
    if (!q || !/^https?:\/\/(www\.)?twitter\.com\//.test(q)) {
      await sendBanner(ctx, '❗ Usage: .twimg <twitter post url>');
      return;
    }
    try {
      const res = await axios.get(`https://api.akuari.my.id/downloader/twdl?link=${encodeURIComponent(q)}`);
      if (res.data && res.data.media && res.data.media.length) {
        for (const media of res.data.media) {
          if (media.type === "video") {
            await ctx.replyWithVideo({ url: media.url });
          } else {
            await ctx.replyWithPhoto({ url: media.url });
          }
        }
      } else {
        await sendBanner(ctx, '🚫 No Twitter media found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch Twitter media.');
    }
  });
};