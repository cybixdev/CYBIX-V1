const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('deepseek', async ctx => {
    const prompt = ctx.message.text.replace(/\/deepseek\s?/i, '').trim();
    if (!prompt) return ctx.reply('Usage: /deepseek <your message>');
    try {
      const { data } = await axios.post('https://deepseek-chat-api.vercel.app/api', { prompt });
      await sendBannerAndButtons(ctx, `🤖 DeepSeek:\n${data.reply || "No response."}`);
    } catch {
      await ctx.reply('❌ Failed to get DeepSeek response.');
    }
  });
};