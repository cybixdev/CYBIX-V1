const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.insta (.+)/i,
  async handler(ctx) {
    const instaUrl = ctx.match[1];
    const url = `https://api.amosayomide05.cf/instagram?url=${encodeURIComponent(instaUrl)}`;
    const res = await axios.get(url);
    if (res.data.result && res.data.result.media) {
      await ctx.replyWithDocument(
        { url: res.data.result.media },
        {
          caption: `📸 Instagram Media`,
          reply_markup: { inline_keyboard: buttons }
        }
      );
    } else {
      await ctx.reply('❌ No Instagram media found.');
    }
  }
};