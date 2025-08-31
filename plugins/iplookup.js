const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('iplookup', async ctx => {
    const ip = ctx.message.text.replace(/\/iplookup\s?/i, '').trim();
    if (!ip) return ctx.reply('Usage: /iplookup <ip>');
    try {
      const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
      await sendBannerAndButtons(ctx, `🌐 IP Lookup:\n${JSON.stringify(data, null, 2)}`);
    } catch {
      await ctx.reply('❌ Failed to lookup IP.');
    }
  });
};