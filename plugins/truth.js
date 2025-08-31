const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('truth', async ctx => {
    try {
      const { data } = await axios.get('https://api.truthordarebot.xyz/v1/truth');
      await sendBannerAndButtons(ctx, `🧊 Truth:\n${data.question || "No truth found."}`);
    } catch {
      await ctx.reply('❌ Failed to get truth.');
    }
  });
};