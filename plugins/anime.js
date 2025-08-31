const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('anime', async ctx => {
    try {
      const { data } = await axios.get('https://api.waifu.pics/sfw/anime');
      await sendBannerAndButtons(ctx, `🎌 Anime:\n${data.url || "No anime found."}`);
    } catch {
      await ctx.reply('❌ Failed to get anime.');
    }
  });
};