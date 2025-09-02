const axios = require('axios');
module.exports.example = '.instagram <url>';
module.exports = function(bot) {
  bot.hears(/^\.instagram (.+)$/i, async ctx => {
    const url = ctx.match[1];
    try {
      // Public API: igdownloader.com
      await ctx.reply(`Download here: https://igdownloader.com?url=${encodeURIComponent(url)}`);
    } catch (e) {
      await ctx.reply("❌ Error: " + e.message);
    }
  });
};