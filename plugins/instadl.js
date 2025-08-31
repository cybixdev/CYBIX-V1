const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('instadl', async ctx => {
    const url = ctx.message.text.replace(/\/instadl\s?/i, '').trim();
    if (!url || !url.startsWith('https://')) return ctx.reply('Usage: /instadl <instagram url>');
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/downloader/igdl?url=${encodeURIComponent(url)}`);
      await sendBannerAndButtons(ctx, `📸 Instagram Download:\n${data.result?.join('\n') || "No media found."}`);
    } catch {
      await ctx.reply('❌ Failed to download Instagram media.');
    }
  });
};