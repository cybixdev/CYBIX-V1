const axios = require('axios');
module.exports = {
  command: 'meme',
  handler: async (ctx, sendBanner) => {
    try {
      const res = await axios.get('https://api.princetechn.com/api/fun/meme?apikey=prince');
      if (res.data.url) {
        await ctx.replyWithPhoto(res.data.url, {
          caption: `*Meme:*\n${res.data.title || ''}`,
          ...require('../../index').buttons,
          parse_mode: 'Markdown'
        });
      } else {
        await sendBanner(ctx, `*Meme:*\n${JSON.stringify(res.data)}`);
      }
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch meme.');
    }
  }
};