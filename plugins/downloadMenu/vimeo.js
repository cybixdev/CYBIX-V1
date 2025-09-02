const axios = require('axios');
module.exports.example = '.vimeo <url>';
module.exports = function(bot) {
  bot.hears(/^\.vimeo (.+)$/i, async ctx => {
    const url = ctx.match[1];
    try {
      // Public API: savevideo.me
      await ctx.reply(`Go to https://www.savevideo.me/download.php and paste your Vimeo URL for download.`);
    } catch (e) {
      await ctx.reply("❌ Error: " + e.message);
    }
  });
};