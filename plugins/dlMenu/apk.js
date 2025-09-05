const axios = require('axios');

module.exports = function(bot, config) {
  bot.command('apk', async ctx => {
    try {
      const appName = ctx.message.text.split(' ').slice(1).join(' ');
      const url = `https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=${encodeURIComponent(appName)}`;
      const res = await axios.get(url);
      const result = res.data.result || res.data.url || "No result found";
      await ctx.replyWithPhoto(
        await config.getBanner(),
        {
          caption: `📦 APK:\n${result}`,
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
    } catch (e) {
      await ctx.reply('Failed to fetch APK result.');
    }
  });
};