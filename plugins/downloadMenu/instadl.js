const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('instadl', async (ctx) => {
    const q = ctx.message.text.replace(/^\.instadl\s*/, '').trim();
    if (!q || !/^https?:\/\/(www\.)?instagram\.com\//.test(q)) {
      await sendBanner(ctx, '❗ Usage: .instadl <instagram post url>');
      return;
    }
    try {
      const res = await axios.get(`https://api.akuari.my.id/downloader/igdl?link=${encodeURIComponent(q)}`);
      if (res.data && res.data.media && res.data.media.length) {
        for (const media of res.data.media) {
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