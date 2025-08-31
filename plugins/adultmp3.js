const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('adultmp3', async ctx => {
    try {
      // Using moan API as demo mp3
      const { data } = await axios.get('https://nekos.life/api/v2/img/moan');
      await sendBannerAndButtons(ctx, `🔊 Adult MP3:\n${data.url || "No mp3 found."}`);
    } catch {
      await ctx.reply('❌ Failed to get adult mp3.');
    }
  });
};