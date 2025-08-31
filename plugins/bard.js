const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('bard', async ctx => {
    const prompt = ctx.message.text.replace(/\/bard\s?/i, '').trim();
    if (!prompt) return ctx.reply('Usage: /bard <your message>');
    try {
      const { data } = await axios.get(`https://bard-api.vercel.app/api?q=${encodeURIComponent(prompt)}`);
      await sendBannerAndButtons(ctx, `🎭 Bard:\n${data.result || "No response."}`);
    } catch {
      await ctx.reply('❌ Failed to get Bard response.');
    }
  });
};