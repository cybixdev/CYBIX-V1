const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.play (.+)/i,
  async handler(ctx) {
    const query = ctx.match[1];
    const url = `https://api.amosayomide05.cf/song?query=${encodeURIComponent(query)}`;
    const res = await axios.get(url);
    if (res.data.result && res.data.result.audio) {
      await ctx.replyWithAudio(
        { url: res.data.result.audio },
        {
          caption: `🎶 Song: ${query}`,
          reply_markup: { inline_keyboard: buttons }
        }
      );
    } else {
      await ctx.reply('❌ No audio found.');
    }
  }
};