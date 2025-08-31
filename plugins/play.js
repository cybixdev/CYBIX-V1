const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('play', async ctx => {
    const song = ctx.message.text.replace(/\/play\s?/i, '').trim();
    if (!song) return ctx.reply('Usage: /play <song name>');
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/downloader/ytplayaudio?query=${encodeURIComponent(song)}`);
      await sendBannerAndButtons(ctx, `🎵 Song for "${song}":\n${data.result?.url || "No song found."}`);
    } catch {
      await ctx.reply('❌ Failed to get song.');
    }
  });
};