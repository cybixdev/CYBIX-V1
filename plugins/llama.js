const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('llama', async ctx => {
    const prompt = ctx.message.text.replace(/\/llama\s?/i, '').trim();
    if (!prompt) return ctx.reply('Usage: /llama <your message>');
    try {
      const { data } = await axios.post('https://api.llama-api.com/chat', { prompt });
      await sendBannerAndButtons(ctx, `🦙 Llama:\n${data.reply || "No response."}`);
    } catch {
      await ctx.reply('❌ Failed to get Llama response.');
    }
  });
};