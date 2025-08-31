const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('dare', async ctx => {
    try {
      const { data } = await axios.get('https://api.truthordarebot.xyz/v1/dare');
      await sendBannerAndButtons(ctx, `🔥 Dare:\n${data.question || "No dare found."}`);
    } catch {
      await ctx.reply('❌ Failed to get dare.');
    }
  });
};