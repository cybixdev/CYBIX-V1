const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('sexaudio', async ctx => {
    try {
      // Using moan API as demo
      const { data } = await axios.get('https://nekos.life/api/v2/img/moan');
      await sendBannerAndButtons(ctx, `🔊 Sex audio:\n${data.url || "No audio found."}`);
    } catch {
      await ctx.reply('❌ Failed to get sex audio.');
    }
  });
};