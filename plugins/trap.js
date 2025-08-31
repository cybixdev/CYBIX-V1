const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('trap', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/trap');
      await sendBannerAndButtons(ctx, `⚧️ Trap:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get trap.');
    }
  });
};