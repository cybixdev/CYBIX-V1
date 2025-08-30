const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.bard (.+)/i,
  async handler(ctx) {
    const query = ctx.match[1];
    const url = `https://bardapi.site/api/search?q=${encodeURIComponent(query)}`;
    const res = await axios.get(url);
    await ctx.replyWithPhoto(
      { url: banner },
      {
        caption: `🤖 ${res.data.answer || 'No response.'}`,
        reply_markup: { inline_keyboard: buttons }
      }
    );
  }
};