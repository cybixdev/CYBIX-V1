const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('chatgpt', async ctx => {
    const prompt = ctx.message.text.replace(/\/chatgpt\s?/i, '').trim();
    if (!prompt) return ctx.reply('Usage: /chatgpt <your message>');
    try {
      // Uses openai's free endpoint via Vercel wrapper (limit per IP)
      const { data } = await axios.post('https://openai-api-v2.vercel.app/api/completions', {
        prompt,
        model: "gpt-3.5-turbo"
      });
      await sendBannerAndButtons(ctx, `🤖 ChatGPT:\n${data.text || data.choices?.[0]?.text || "No response."}`);
    } catch {
      await ctx.reply('❌ Failed to get AI response.');
    }
  });
};