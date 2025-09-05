const axios = require('axios');
module.exports = {
  command: 'calc',
  handler: async (ctx, sendBanner) => {
    const expr = ctx.message.text.split(' ').slice(1).join(' ');
    if (!expr) return sendBanner(ctx, 'Usage: .calc <expression>');
    try {
      // Using Math.js API
      const res = await axios.get('https://api.mathjs.org/v4/', {
        params: { expr }
      });
      await sendBanner(ctx, `*Result:*\n${res.data}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to calculate.');
    }
  }
};