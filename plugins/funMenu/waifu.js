const axios = require('axios');
module.exports = {
  command: 'waifu',
  handler: async (ctx, sendBanner) => {
    try {
      const res = await axios.get('https://api.princetechn.com/api/fun/waifu?apikey=prince');
      if (res.data.url) {
        await ctx.replyWithPhoto(res.data.url, {
          caption: '*Waifu!*',
          ...require('../../index').buttons,
          parse_mode: 'Markdown'
        });
      } else {
        await sendBanner(ctx, `*Waifu:*\n${JSON.stringify(res.data)}`);
      }
    } catch (e) {
      await sendBanner(ctx, 'Failed to fetch waifu.');
    }
  }
};