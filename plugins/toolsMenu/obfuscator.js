const axios = require('axios');
module.exports = {
  command: 'obfuscator',
  handler: async (ctx, sendBanner) => {
    const code = ctx.message.text.split(' ').slice(1).join(' ');
    if (!code) return sendBanner(ctx, 'Usage: .obfuscator <your js code>');
    try {
      // Using public JS obfuscator API
      const res = await axios.post('https://www.obfuscator.io/api/obfuscate', { code });
      await sendBanner(ctx, `*Obfuscated Code:*\n${res.data.obfuscated || JSON.stringify(res.data)}`);
    } catch (e) {
      await sendBanner(ctx, 'Failed to obfuscate code.');
    }
  }
};