const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('lewd', async ctx => {
    try {
      const { data } = await axios.get('https://waifu.pics/api/nsfw/neko');
      await sendBannerAndButtons(ctx, `💦 Lewd:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get lewd image.');
    }
  });
};