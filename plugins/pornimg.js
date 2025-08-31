const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('pornimg', async ctx => {
    const keyword = ctx.message.text.replace(/\/pornimg\s?/i, '').trim();
    if (!keyword) return ctx.reply('Usage: /pornimg <keyword>');
    try {
      // Reddit NSFW image API
      const { data } = await axios.get(`https://meme-api.com/gimme/${encodeURIComponent(keyword)}/nsfw`);
      await sendBannerAndButtons(ctx, `🔞 Porn image for "${keyword}":\n${data.url || "No image found."}`);
    } catch {
      await ctx.reply('❌ Failed to get porn image.');
    }
  });
};