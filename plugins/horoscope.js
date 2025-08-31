const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('horoscope', async ctx => {
    const sign = ctx.message.text.replace(/\/horoscope\s?/i, '').trim().toLowerCase();
    if (!sign) return ctx.reply('Usage: /horoscope <sign>');
    try {
      const { data } = await axios.get(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, { method: 'POST' });
      await sendBannerAndButtons(ctx, `🔮 Horoscope (${sign}):\n${data.description || "No horoscope found."}`);
    } catch {
      await ctx.reply('❌ Failed to get horoscope.');
    }
  });
};