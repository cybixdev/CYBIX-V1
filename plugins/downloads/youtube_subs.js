const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.youtube_subs (.+)/i,
  async handler(ctx) {
    const url = ctx.match[1];
    const apiUrl = `https://youtube-subtitles-api.vercel.app/api/subtitles?url=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl);
    if (res.data.subtitles) {
      await ctx.replyWithDocument(
        { source: Buffer.from(res.data.subtitles, 'utf-8'), filename: 'subtitles.srt' },
        {
          caption: `📝 YouTube Subtitles`,
          reply_markup: { inline_keyboard: buttons }
        }
      );
    } else {
      await ctx.reply('❌ No subtitles found.');
    }
  }
};