const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)play\s+(.+)/i, async ctx => {
    try {
      const url = ctx.match[2];
      const { data } = await axios.get("https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=" + encodeURIComponent(url));
      const audioUrl = data.result;
      const { photo, buttons } = getBannerAndButtons();
      if (audioUrl) {
        await ctx.replyWithAudio({ url: audioUrl }, {
          caption: `*Play*\n${audioUrl}`,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: buttons }
        });
      } else {
        await ctx.replyWithPhoto({ url: photo }, {
          caption: "No audio found.",
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: buttons }
        });
      }
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to fetch audio.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};