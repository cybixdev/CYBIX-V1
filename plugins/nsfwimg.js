const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('nsfwimg', async ctx => {
    try {
      const { data } = await axios.get('https://waifu.pics/api/nsfw/waifu');
      await sendBannerAndButtons(ctx, `🖼️ NSFW Waifu:\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get NSFW waifu.');
    }
  });
};