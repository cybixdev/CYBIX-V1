const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('trivia', async ctx => {
    try {
      const { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
      const q = data.results?.[0];
      await sendBannerAndButtons(ctx, `🎲 Trivia:\n${q?.question}\nA: ${q?.correct_answer}`);
    } catch {
      await ctx.reply('❌ Failed to get trivia.');
    }
  });
};