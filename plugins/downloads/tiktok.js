const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.tiktok (.+)/i,
  async handler(ctx) {
    const tiktokUrl = ctx.match[1];
    const url = `https://api.amosayomide05.cf/tiktok?url=${encodeURIComponent(tiktokUrl)}`;
    const res = await axios.get(url);
    if (res.data.result && res.data.result.media) {
      await ctx.replyWithVideo(
        { url: res.data.result.media },
        {
          caption: `🎵 TikTok Media`,
          reply_markup: { inline_keyboard: buttons }
        }
      );
    } else {
      await ctx.reply('❌ No TikTok media found.');
    }
  }
};