const axios = require('axios');
module.exports = {
  command: 'nudes',
  handler: async (ctx, sendBanner) => {
    try {
      // Using public API for lewd images (nekos.life lewd)
      const res = await axios.get('https://nekos.life/api/v2/img/lewd');
      await ctx.replyWithPhoto(res.data.url, {
        caption: '*Nudes*',
        ...require('../../index').buttons,
        parse_mode: 'Markdown'
      });
    } catch (e) {
      await sendBanner(ctx, 'Failed to get nudes image.');
    }
  }
};