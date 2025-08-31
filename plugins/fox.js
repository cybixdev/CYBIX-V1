const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('fox', async ctx => {
    try {
      const { data } = await axios.get('https://randomfox.ca/floof/');
      await sendBannerAndButtons(ctx, `🦊 Fox:\n${data.image || "No fox found."}`);
    } catch {
      await ctx.reply('❌ Failed to get fox.');
    }
  });
};