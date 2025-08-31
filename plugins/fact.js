const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('fact', async ctx => {
    try {
      const { data } = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      await sendBannerAndButtons(ctx, `🧠 Fact:\n${data.text || "No fact found."}`);
    } catch {
      await ctx.reply('❌ Failed to get fact.');
    }
  });
};