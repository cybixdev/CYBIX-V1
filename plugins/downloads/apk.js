const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.apk (.+)/i,
  async handler(ctx) {
    const query = ctx.match[1];
    const url = `https://api.amosayomide05.cf/apk?query=${encodeURIComponent(query)}`;
    const res = await axios.get(url);
    if (res.data.result) {
      await ctx.replyWithDocument(
        { url: res.data.result },
        {
          caption: `📦 APK for ${query}`,
          reply_markup: { inline_keyboard: buttons }
        }
      );
    } else {
      await ctx.reply('❌ No APK found.');
    }
  }
};