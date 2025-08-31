const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('dog', async ctx => {
    try {
      const { data } = await axios.get('https://dog.ceo/api/breeds/image/random');
      await sendBannerAndButtons(ctx, `🐶 Dog:\n${data.message || "No dog found."}`);
    } catch {
      await ctx.reply('❌ Failed to get dog.');
    }
  });
};