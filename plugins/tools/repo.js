const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.repo$/i,
  async handler(ctx) {
    await ctx.replyWithPhoto(
      { url: banner },
      {
        caption: `📦 Repo: https://github.com/NOT FOR FREE`,
        reply_markup: { inline_keyboard: buttons }
      }
    );
  }
};