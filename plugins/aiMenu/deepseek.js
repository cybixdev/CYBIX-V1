const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)deepseek\s+(.+)/i, async ctx => {
    try {
      const q = ctx.match[2];
      const { data } = await axios.get("https://api.princetechn.com/api/ai/deepseek-v3?apikey=prince&q=" + encodeURIComponent(q));
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: `*DeepSeek*\n\n${data.result || "No response."}`,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to fetch DeepSeek result.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};