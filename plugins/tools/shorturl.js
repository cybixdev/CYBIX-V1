const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.shorturl (.+)/i,
  async handler(ctx) {
    const url = ctx.match[1];
    const api = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);
    await ctx.replyWithPhoto(
      { url: banner },
      {
        caption: `Short URL: ${res.data}`,
        reply_markup: { inline_keyboard: buttons }
      }
    );
  }
};