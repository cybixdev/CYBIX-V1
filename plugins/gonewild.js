const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('gonewild', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/gonewild');
      await sendBannerAndButtons(ctx, `🔥 Gonewild:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get gonewild.');
    }
  });
};