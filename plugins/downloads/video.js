const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.video (.+)/i,
  async handler(ctx) {
    const videoUrl = ctx.match[1];
    const url = `https://api.amosayomide05.cf/ytmp4?url=${encodeURIComponent(videoUrl)}`;
    const res = await axios.get(url);
    if (res.data.result && res.data.result.video) {
      await ctx.replyWithVideo(
        { url: res.data.result.video },
        {
          caption: `🎥 Video: ${videoUrl}`,
          reply_markup: { inline_keyboard: buttons }
        }
      );
    } else {
      await ctx.reply('❌ Unable to fetch video.');
    }
  }
};