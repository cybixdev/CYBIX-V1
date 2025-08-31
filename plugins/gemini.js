const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('gemini', async ctx => {
    const prompt = ctx.message.text.replace(/\/gemini\s?/i, '').trim();
    if (!prompt) return ctx.reply('Usage: /gemini <your message>');
    try {
      const { data } = await axios.post('https://gemini-api-demo.vercel.app/api/gemini', { prompt });
      await sendBannerAndButtons(ctx, `✨ Gemini:\n${data.completion || "No response."}`);
    } catch {
      await ctx.reply('❌ Failed to get Gemini response.');
    }
  });
};