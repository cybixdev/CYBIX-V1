const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('hentai', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/hentai');
      await sendBannerAndButtons(ctx, `🔞 Hentai:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get hentai.');
    }
  });
};