const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('adultgif', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/Random_hentai_gif');
      await sendBannerAndButtons(ctx, `🎬 Adult GIF:\n${data.url || "No gif found."}`);
    } catch {
      await ctx.reply('❌ Failed to get adult gif.');
    }
  });
};