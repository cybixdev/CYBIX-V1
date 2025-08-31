const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('cum', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/cum');
      await sendBannerAndButtons(ctx, `💦 Cum:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get cum.');
    }
  });
};