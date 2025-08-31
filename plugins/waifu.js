const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('waifu', async ctx => {
    try {
      const { data } = await axios.get('https://api.waifu.pics/sfw/waifu');
      await sendBannerAndButtons(ctx, `👧 Waifu:\n${data.url || "No waifu found."}`);
    } catch {
      await ctx.reply('❌ Failed to get waifu.');
    }
  });
};