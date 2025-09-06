const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)dl-xnxx\s+(.+)/i, async ctx => {
    try {
      const url = ctx.match[2];
      const res = await axios.get("https://api.princetechn.com/api/download/xnxxdl?apikey=prince&url=" + encodeURIComponent(url));
      const vid = res.data.result || res.data.url || '';
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: vid ? `*XNXX Download*\n${vid}` : "No video found.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to fetch xnxx video.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};