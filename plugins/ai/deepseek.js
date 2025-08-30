const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.deepseek (.+)/i,
  async handler(ctx) {
    const query = ctx.match[1];
    const url = `https://api.amosayomide05.cf/deepseek?question=${encodeURIComponent(query)}`;
    const res = await axios.get(url);
    await ctx.replyWithPhoto(
      { url: banner },
      {
        caption: `🤖 ${res.data.response}`,
        reply_markup: { inline_keyboard: buttons }
      }
    );
  }
};