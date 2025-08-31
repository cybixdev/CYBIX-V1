const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('apk', async ctx => {
    const app = ctx.message.text.replace(/\/apk\s?/i, '').trim();
    if (!app) return ctx.reply('Usage: /apk <app name>');
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/downloader/apk?query=${encodeURIComponent(app)}`);
      await sendBannerAndButtons(ctx, `📱 APK Links for "${app}":\n${data.result?.join('\n') || "No APK found."}`);
    } catch {
      await ctx.reply('❌ Failed to get APK.');
    }
  });
};