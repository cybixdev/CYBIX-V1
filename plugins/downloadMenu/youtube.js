const axios = require('axios');
module.exports.example = '.youtube <url>';
module.exports = function(bot) {
  bot.hears(/^\.youtube (.+)$/i, async ctx => {
    const url = ctx.match[1];
    try {
      // Public API: yt-download.org
      const api = `https://api.yt-download.org/api/button/mp3/${encodeURIComponent(url)}`;
      await ctx.reply(`Download MP3:\n${api}`);
    } catch (e) {
      await ctx.reply("❌ Error: " + e.message);
    }
  });
};