const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.youtube_audio (.+)/i,
  async handler(ctx) {
    const url = ctx.match[1];
    const apiUrl = `https://api.amosayomide05.cf/ytmp3?url=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl);
    if (res.data.result && res.data.result.audio) {
      await ctx.replyWithAudio(
        { url: res.data.result.audio },
        {
          caption: `🎧 YouTube Audio`,
          reply_markup: { inline_keyboard: buttons }
        }
      );
    } else {
      await ctx.reply('❌ No audio found.');
    }
  }
};