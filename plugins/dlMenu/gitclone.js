const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)gitclone\s+(.+)/i, async ctx => {
    try {
      const url = ctx.match[2];
      const { data } = await axios.get("https://api.princetechn.com/api/download/gitclone?apikey=prince&url=" + encodeURIComponent(url));
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: data.result ? `*Git Clone*\n${data.result}` : "Clone failed.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to clone repo.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};