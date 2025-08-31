const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('video', async ctx => {
    const search = ctx.message.text.replace(/\/video\s?/i, '').trim();
    if (!search) return ctx.reply('Usage: /video <search>');
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/downloader/ytplayvideo?query=${encodeURIComponent(search)}`);
      await sendBannerAndButtons(ctx, `📹 Video for "${search}":\n${data.result?.url || "No video found."}`);
    } catch {
      await ctx.reply('❌ Failed to get video.');
    }
  });
};