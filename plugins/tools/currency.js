const axios = require('axios');
const { banner, buttons } = require('../../config');
module.exports = {
  pattern: /^\.currency (.+)/i,
  async handler(ctx) {
    const code = ctx.match[1].toUpperCase();
    const url = `https://open.er-api.com/v6/latest/${code}`;
    const res = await axios.get(url);
    if (res.data && res.data.rates) {
      await ctx.replyWithPhoto(
        { url: banner },
        {
          caption: `Currency: 1 ${code} = ${res.data.rates.USD} USD`,
          reply_markup: { inline_keyboard: buttons }
        }
      );
    } else {
      await ctx.reply('❌ Currency not found.');
    }
  }
};