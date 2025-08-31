const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('suno', async ctx => {
    const text = ctx.message.text.replace(/\/suno\s?/i, '').trim();
    if (!text) return ctx.reply('Usage: /suno <song prompt>');
    try {
      // Suno public demo endpoint (returns song link)
      const { data } = await axios.post('https://suno-api-demo.vercel.app/api/suno', { prompt: text });
      await sendBannerAndButtons(ctx, `🎶 Suno:\n${data.url || "No song found."}`);
    } catch {
      await ctx.reply('❌ Failed to get Suno song.');
    }
  });
};