const axios = require('axios');

module.exports = function(bot, config) {
  bot.command('openai', async ctx => {
    try {
      const query = ctx.message.text.split(' ').slice(1).join(' ');
      const url = `https://api.princetechn.com/api/ai/openai?apikey=prince&q=${encodeURIComponent(query)}`;
      const res = await axios.get(url);
      const answer = res.data.result || "No answer found";
      await ctx.replyWithPhoto(
        await config.getBanner(),
        {
          caption: `🤖 OpenAI:\n${answer}`,
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Telegram Channel", url: "https://t.me/cybixtech" },
                { text: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" }
              ]
            ]
          }
        }
      );
    } catch (e) {
      await ctx.reply('Failed to fetch OpenAI response.');
    }
  });
};