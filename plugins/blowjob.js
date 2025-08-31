const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('blowjob', async ctx => {
    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/blowjob');
      await sendBannerAndButtons(ctx, `👄 Blowjob:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get blowjob.');
    }
  });
};