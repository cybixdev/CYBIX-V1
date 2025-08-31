const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('pornvid', async ctx => {
    const keyword = ctx.message.text.replace(/\/pornvid\s?/i, '').trim();
    if (!keyword) return ctx.reply('Usage: /pornvid <keyword>');
    try {
      // PornHub public search API (returns preview video links)
      const { data } = await axios.get(`https://api.phub.ai/search/videos?search=${encodeURIComponent(keyword)}`);
      if (data && data.data && data.data.length > 0) {
        await sendBannerAndButtons(ctx, `🔞 Porn video for "${keyword}":\n${data.data[0].videoUrl || data.data[0].url}`);
      } else {
        await ctx.reply('❌ No video found.');
      }
    } catch {
      await ctx.reply('❌ Failed to get porn video.');
    }
  });
};