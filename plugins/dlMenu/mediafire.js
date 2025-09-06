const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)mediafire\s+(.+)/i, async ctx => {
    try {
      const url = ctx.match[2];
      const { data } = await axios.get("https://api.princetechn.com/api/download/mediafire?apikey=prince&url=" + encodeURIComponent(url));
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: data.result ? `*Mediafire Download*\n${data.result}` : "Mediafire file not found.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to fetch Mediafire link.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};