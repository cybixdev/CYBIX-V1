const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('yuri', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/yuri');
      await sendBannerAndButtons(ctx, `👭 Yuri:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get yuri.');
    }
  });
};