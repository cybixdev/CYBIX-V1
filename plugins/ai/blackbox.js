const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.blackbox (.+)/i,
  async handler(ctx) {
    const query = ctx.match[1];
    const url = `https://api.blackbox.ai/ask?q=${encodeURIComponent(query)}`;
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