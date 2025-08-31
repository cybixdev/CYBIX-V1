const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('yaoi', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/yaoi');
      await sendBannerAndButtons(ctx, `👬 Yaoi:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get yaoi.');
    }
  });
};