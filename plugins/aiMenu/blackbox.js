const axios = require('axios');
module.exports.example = '.blackbox <question>';
module.exports = function(bot) {
  bot.hears(/^\.blackbox (.+)$/i, async ctx => {
    const question = ctx.match[1];
    try {
      const response = await axios.post(
        'https://api.deepai.org/api/text-generator',
        { text: question },
        { headers: { 'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K' } }
      );
      await ctx.reply(response.data.output || "No response.");
    } catch (e) {
      await ctx.reply("❌ Error: " + (e.response?.data?.error || e.message));
    }
  });
};