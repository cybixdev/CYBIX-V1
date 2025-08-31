const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('blackbox', async ctx => {
    const prompt = ctx.message.text.replace(/\/blackbox\s?/i, '').trim();
    if (!prompt) return ctx.reply('Usage: /blackbox <your message>');
    try {
      const { data } = await axios.get(`https://blackbox-ai.vercel.app/api/generate?prompt=${encodeURIComponent(prompt)}`);
      await sendBannerAndButtons(ctx, `🕶️ Blackbox AI:\n${data.result || "No response."}`);
    } catch {
      await ctx.reply('❌ Failed to get Blackbox response.');
    }
  });
};