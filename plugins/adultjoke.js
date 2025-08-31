const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('adultjoke', async ctx => {
    try {
      const { data } = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single&category=sex');
      await sendBannerAndButtons(ctx, `🤣 NSFW Joke:\n${data.joke || "No joke found."}`);
    } catch {
      await ctx.reply('❌ Failed to get NSFW joke.');
    }
  });
};