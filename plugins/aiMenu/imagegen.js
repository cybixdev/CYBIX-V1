const axios = require('axios');
module.exports.example = '.imagegen <description>';
module.exports = function(bot) {
  bot.hears(/^\.imagegen (.+)$/i, async ctx => {
    const desc = ctx.match[1];
    try {
      const response = await axios.post(
        'https://api.deepai.org/api/text2img',
        { text: desc },
        { headers: { 'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K' } }
      );
      await ctx.replyWithPhoto(response.data.output_url);
    } catch (e) {
      await ctx.reply("❌ Error: " + (e.response?.data?.error || e.message));
    }
  });
};