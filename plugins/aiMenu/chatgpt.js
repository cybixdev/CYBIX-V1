const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)chatgpt\s+(.+)/i, async ctx => {
    try {
      const q = ctx.match[2];
      const { data } = await axios.get("https://api.princetechn.com/api/ai/gpt?apikey=prince&q=" + encodeURIComponent(q));
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: `*ChatGPT*\n\n${data.result || "No response."}`,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to fetch ChatGPT result.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};