const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('sexstory', async ctx => {
    try {
      // Random NSFW story API
      const { data } = await axios.get('https://api.quotable.io/random?tags=nsfw');
      await sendBannerAndButtons(ctx, `📖 NSFW Story:\n${data.content || "No story found."}`);
    } catch {
      await ctx.reply('❌ Failed to get NSFW story.');
    }
  });
};