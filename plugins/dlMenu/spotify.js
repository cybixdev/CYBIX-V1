const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)spotify\s+(.+)/i, async ctx => {
    try {
      const url = ctx.match[2];
      const { data } = await axios.get("https://api.princetechn.com/api/download/spotifydlv2?apikey=prince&url=" + encodeURIComponent(url));
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: data.result ? `*Spotify Download*\n${data.result}` : "Track not found.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to fetch Spotify track.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};