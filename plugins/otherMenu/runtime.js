const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)runtime\s*$/i, async ctx => {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: `*Bot Uptime*\n${h}h ${m}m ${s}s`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  });
};