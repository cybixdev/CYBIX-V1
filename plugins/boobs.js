const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('boobs', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/boobs');
      await sendBannerAndButtons(ctx, `🍒 Boobs:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get boobs.');
    }
  });
};