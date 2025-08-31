const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('wallpaper', async ctx => {
    try {
      // Catboys wallpaper API
      const { data } = await axios.get('https://api.catboys.com/img');
      await sendBannerAndButtons(ctx, `🖼️ Wallpaper:\n${data.url || "No wallpaper found."}`);
    } catch {
      await ctx.reply('❌ Failed to get wallpaper.');
    }
  });
};