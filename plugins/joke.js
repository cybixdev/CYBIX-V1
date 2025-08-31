const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('joke', async ctx => {
    try {
      const { data } = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single');
      await sendBannerAndButtons(ctx, `😂 Joke:\n${data.joke || "No joke found."}`);
    } catch {
      await ctx.reply('❌ Failed to get joke.');
    }
  });
};