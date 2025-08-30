const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.image (.+)/i,
  async handler(ctx) {
    const query = ctx.match[1];
    // Free API for random images based on keywords
    const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
    await ctx.replyWithPhoto(
      { url },
      {
        caption: `🖼️ Image: ${query}`,
        reply_markup: { inline_keyboard: buttons }
      }
    );
  }
};