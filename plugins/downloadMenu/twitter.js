const axios = require('axios');
module.exports.example = '.twitter <url>';
module.exports = function(bot) {
  bot.hears(/^\.twitter (.+)$/i, async ctx => {
    const url = ctx.match[1];
    try {
      // Public API: twdown.net
      await ctx.reply(`Download here: https://twdown.net/download.php?url=${encodeURIComponent(url)}`);
    } catch (e) {
      await ctx.reply("❌ Error: " + e.message);
    }
  });
};