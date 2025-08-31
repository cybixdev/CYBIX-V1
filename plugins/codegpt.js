const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('codegpt', async ctx => {
    const prompt = ctx.message.text.replace(/\/codegpt\s?/i, '').trim();
    if (!prompt) return ctx.reply('Usage: /codegpt <your code prompt>');
    try {
      const { data } = await axios.post('https://codegpt-api-demo.vercel.app/api/code', { prompt });
      await sendBannerAndButtons(ctx, `💻 CodeGPT:\n${data.result || "No response."}`);
    } catch {
      await ctx.reply('❌ Failed to get CodeGPT response.');
    }
  });
};