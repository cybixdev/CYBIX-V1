const axios = require('axios');
module.exports.example = '.chatgpt <prompt>';
module.exports = function(bot) {
  bot.hears(/^\.chatgpt (.+)$/i, async ctx => {
    const prompt = ctx.match[1];
    try {
      const response = await axios.post(
        'https://api.deepai.org/api/text-generator',
        { text: prompt },
        { headers: { 'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K' } }
      );
      await ctx.reply(response.data.output || "No response.");
    } catch (e) {
      await ctx.reply("❌ Error: " + (e.response?.data?.error || e.message));
    }
  });
};