const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('advice', async ctx => {
    try {
      const { data } = await axios.get('https://api.adviceslip.com/advice');
      await sendBannerAndButtons(ctx, `📝 Advice:\n${data.slip?.advice || "No advice found."}`);
    } catch {
      await ctx.reply('❌ Failed to get advice.');
    }
  });
};