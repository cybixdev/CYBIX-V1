const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('meme', async ctx => {
    try {
      const { data } = await axios.get('https://meme-api.com/gimme');
      await sendBannerAndButtons(ctx, `😂 Meme:\n${data.url || "No meme found."}`);
    } catch {
      await ctx.reply('❌ Failed to get meme.');
    }
  });
};