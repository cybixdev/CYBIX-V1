const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('ass', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/ass');
      await sendBannerAndButtons(ctx, `🍑 Ass:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get ass.');
    }
  });
};