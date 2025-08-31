const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('thighs', async ctx => {
    try {
      const { data } = await axios.get('https://waifu.pics/api/nsfw/thighs');
      await sendBannerAndButtons(ctx, `🦵 Thighs:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get thighs.');
    }
  });
};