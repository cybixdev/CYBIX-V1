const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)apk\s+(.+)/i, async ctx => {
    try {
      const app = ctx.match[2];
      const { data } = await axios.get("https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=" + encodeURIComponent(app));
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: data.result ? `*APK Download for ${app}*\n${data.result}` : "No APK found.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to fetch APK.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};