const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('cat', async ctx => {
    try {
      const { data } = await axios.get('https://aws.random.cat/meow');
      await sendBannerAndButtons(ctx, `🐱 Cat:\n${data.file || "No cat found."}`);
    } catch {
      await ctx.reply('❌ Failed to get cat.');
    }
  });
};