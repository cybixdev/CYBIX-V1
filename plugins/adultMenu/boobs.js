const axios = require('axios');
module.exports = {
  command: 'boobs',
  handler: async (ctx, sendBanner) => {
    try {
      // Using nekos.life API
      const res = await axios.get('https://nekos.life/api/v2/img/boobs');
      await ctx.replyWithPhoto(res.data.url, {
        caption: '*Boobs*',
        ...require('../../index').buttons,
        parse_mode: 'Markdown'
      });
    } catch (e) {
      await sendBanner(ctx, 'Failed to get boobs image.');
    }
  }
};