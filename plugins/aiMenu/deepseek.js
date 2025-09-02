const axios = require('axios');
module.exports.example = '.deepseek <query>';
module.exports = function(bot) {
  bot.hears(/^\.deepseek (.+)$/i, async ctx => {
    const query = ctx.match[1];
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
      const response = await axios.get(url);
      const answer = response.data.AbstractText || response.data.Answer || "No answer found.";
      await ctx.reply(`🔎 Deepseek: ${answer}`);
    } catch (e) {
      await ctx.reply("❌ Error: " + (e.response?.data?.error || e.message));
    }
  });
};