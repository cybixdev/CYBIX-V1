const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('moans', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/moan');
      await sendBannerAndButtons(ctx, `😈 Moan sound:\n${data.url || "No moan found."}`);
    } catch {
      await ctx.reply('❌ Failed to get moan sound.');
    }
  });
};