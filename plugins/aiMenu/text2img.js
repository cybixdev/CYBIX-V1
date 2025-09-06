const axios = require('axios');
const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)text2img\s+(.+)/i, async ctx => {
    try {
      const prompt = ctx.match[2];
      const res = await axios.get("https://api.princetechn.com/api/ai/text2img?apikey=prince&prompt=" + encodeURIComponent(prompt));
      const img = res.data.result || res.data.image || '';
      const { photo, buttons } = getBannerAndButtons();
      if (!img) throw new Error('No image');
      await ctx.replyWithPhoto({ url: img }, {
        caption: `*Text2Img*\n\nPrompt: ${prompt}`,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "Failed to generate image.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  });
};