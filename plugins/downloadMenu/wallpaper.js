const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('wallpaper', async (ctx) => {
    const q = ctx.message.text.replace(/^\.wallpaper\s*/, '') || 'cyberpunk';
    try {
      const res = await axios.get(`https://api.akuari.my.id/randomimg/wallpaper?query=${encodeURIComponent(q)}`);
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