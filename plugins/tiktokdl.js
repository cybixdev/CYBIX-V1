const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('tiktokdl', async ctx => {
    const url = ctx.message.text.replace(/\/tiktokdl\s?/i, '').trim();
    if (!url || !url.startsWith('https://')) return ctx.reply('Usage: /tiktokdl <tiktok url>');
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/downloader/tiktok?url=${encodeURIComponent(url)}`);
      await sendBannerAndButtons(ctx, `📱 TikTok Download:\n${data.result?.video || "No video found."}`);
    } catch {
      await ctx.reply('❌ Failed to download TikTok video.');
    }
  });
};