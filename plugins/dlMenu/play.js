const axios = require('axios');

module.exports = function (bot, config) {
  bot.command('play', async ctx => {
    try {
      const ytUrl = ctx.message.text.split(' ').slice(1).join(' ');
      const url = `https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=${encodeURIComponent(ytUrl)}`;
      const res = await axios.get(url);
      const result = res.data.result || res.data.url || "No result found";
      // If the result is an audio file, send as audio, else as caption
      if (res.data.url && res.data.url.endsWith('.mp3')) {
        await ctx.replyWithAudio(
          { url: res.data.url },
          {
            caption: `🎶 Play:\n${res.data.title || ''}`,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "Telegram Channel", url: "https://t.me/cybixtech" },
                  { text: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" }
                ]
              ]
            }
          }
        );
      } else {
        await ctx.replyWithPhoto(
          await config.getBanner(),
          {
            caption: `🎶 Play:\n${result}`,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "Telegram Channel", url: "https://t.me/cybixtech" },
                  { text: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" }
                ]
              ]
            }
          }
        );
      }
    } catch (e) {
      await ctx.reply('Failed to fetch Play result.');
    }
  });
};