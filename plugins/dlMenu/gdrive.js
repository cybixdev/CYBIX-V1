const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)gdrive\s+(.+)/i, async ctx => {
    try {
      const url = ctx.match[2];
      const { data } = await axios.get("https://api.princetechn.com/api/download/gdrivedl?apikey=prince&url=" + encodeURIComponent(url));
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: data.result ? `*GDrive Download*\n${data.result}` : "GDrive file not found.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to fetch GDrive file.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};