const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.trivia|\/trivia)$/i, async (ctx) => {
    try {
      const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
      if (res.data && res.data.results && res.data.results[0]) {
        const q = res.data.results[0];
        let options = q.incorrect_answers.concat(q.correct_answer).sort(() => Math.random() - 0.5);
        let text = `❓ Trivia\n\n${q.question}\n\nOptions:\n${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nAnswer: ${q.correct_answer}`;
        await sendBanner(ctx, text);
      } else {
        await sendBanner(ctx, '🚫 No trivia found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch trivia.');
    }
  });
};