const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.pinterest (.+)/i,
  async handler(ctx) {
    const pinUrl = ctx.match[1];
    const url = `https://api.amosayomide05.cf/pinterest?url=${encodeURIComponent(pinUrl)}`;
    const res = await axios.get(url);
    if (res.data.result && res.data.result.image) {
      await ctx.replyWithPhoto(
        { url: res.data.result.image },
        {
          caption: `📌 Pinterest Image`,
          reply_markup: { inline_keyboard: buttons }
        }
      );
    } else {
      await ctx.reply('❌ No Pinterest image found.');
    }
  }
};