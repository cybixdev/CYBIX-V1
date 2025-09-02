const axios = require('axios');
module.exports.example = '.summarize <text>';
module.exports = function(bot) {
  bot.hears(/^\.summarize (.+)$/i, async ctx => {
    const text = ctx.match[1];
    try {
      const response = await axios.post(
        'https://api.deepai.org/api/summarization',
        { text },
        { headers: { 'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K' } }
      );
      await ctx.reply(response.data.output || "No response.");
    } catch (e) {
      await ctx.reply("❌ Error: " + (e.response?.data?.error || e.message));
    }
  });
};