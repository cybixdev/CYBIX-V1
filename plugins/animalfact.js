const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('animalfact', async ctx => {
    try {
      const { data } = await axios.get('https://catfact.ninja/fact');
      await sendBannerAndButtons(ctx, `🐾 Animal Fact:\n${data.fact || "No animal fact found."}`);
    } catch {
      await ctx.reply('❌ Failed to get animal fact.');
    }
  });
};