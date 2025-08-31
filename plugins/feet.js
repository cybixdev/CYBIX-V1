const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('feet', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/feet');
      await sendBannerAndButtons(ctx, `🦶 Feet:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get feet.');
    }
  });
};