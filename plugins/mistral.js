const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('mistral', async ctx => {
    const prompt = ctx.message.text.replace(/\/mistral\s?/i, '').trim();
    if (!prompt) return ctx.reply('Usage: /mistral <your message>');
    try {
      const { data } = await axios.post('https://mistral-chat-api.vercel.app/api', { prompt });
      await sendBannerAndButtons(ctx, `🌬️ Mistral:\n${data.reply || "No response."}`);
    } catch {
      await ctx.reply('❌ Failed to get Mistral response.');
    }
  });
};