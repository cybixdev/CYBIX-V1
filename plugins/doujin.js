const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('doujin', async ctx => {
    try {
      const { data } = await axios.get('https://api.waifu.im/sfw/doujin');
      await sendBannerAndButtons(ctx, `📚 Doujin:\n${data.images?.[0]?.url || "No doujin found."}`);
    } catch {
      await ctx.reply('❌ Failed to get doujin.');
    }
  });
};