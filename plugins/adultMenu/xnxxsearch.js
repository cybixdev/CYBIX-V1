const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)xnxxsearch\s+(.+)/i, async ctx => {
    try {
      const query = ctx.match[2];
      const res = await axios.get("https://api.princetechn.com/api/search/xnxxsearch?apikey=prince&query=" + encodeURIComponent(query));
      const links = (res.data.result || []).slice(0, 5).join('\n') || "No results.";
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: `*XNXX Results*\n${links}`,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to fetch xnxx results.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};