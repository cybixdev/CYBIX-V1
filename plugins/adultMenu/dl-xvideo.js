const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)dl-xvideo\s+(.+)/i, async ctx => {
    try {
      const url = ctx.match[2];
      const res = await axios.get("https://api.princetechn.com/api/download/xvideosdl?apikey=prince&url=" + encodeURIComponent(url));
      const vid = res.data.result || res.data.url || '';
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: vid ? `*Xvideos Download*\n${vid}` : "No video found.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to fetch xvideos video.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};