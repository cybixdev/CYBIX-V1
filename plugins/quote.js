const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('quote', async ctx => {
    try {
      const { data } = await axios.get('https://api.quotable.io/random');
      await sendBannerAndButtons(ctx, `💬 Quote:\n${data.content || "No quote found."}`);
    } catch {
      await ctx.reply('❌ Failed to get quote.');
    }
  });
};