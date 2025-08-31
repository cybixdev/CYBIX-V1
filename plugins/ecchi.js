const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('ecchi', async ctx => {
    try {
      const { data } = await axios.get('https://waifu.pics/api/nsfw/ecchi');
      await sendBannerAndButtons(ctx, `🌶️ Ecchi:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get ecchi.');
    }
  });
};