const axios = require('axios');
module.exports = {
  command: 'ass',
  handler: async (ctx, sendBanner) => {
    try {
      // Using nekos.life API
      const res = await axios.get('https://nekos.life/api/v2/img/ass');
      await ctx.replyWithPhoto(res.data.url, {
        caption: '*Ass*',
        ...require('../../index').buttons,
        parse_mode: 'Markdown'
      });
    } catch (e) {
      await sendBanner(ctx, 'Failed to get ass image.');
    }
  }
};