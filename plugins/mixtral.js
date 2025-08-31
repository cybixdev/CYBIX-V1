const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('mixtral', async ctx => {
    const prompt = ctx.message.text.replace(/\/mixtral\s?/i, '').trim();
    if (!prompt) return ctx.reply('Usage: /mixtral <your message>');
    try {
      const { data } = await axios.post('https://mixtral-api.vercel.app/api', { prompt });
      await sendBannerAndButtons(ctx, `🌀 Mixtral:\n${data.reply || "No response."}`);
    } catch {
      await ctx.reply('❌ Failed to get Mixtral response.');
    }
  });
};