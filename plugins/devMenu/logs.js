const { getBannerAndButtons, isOwner } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)logs\s*$/i, async ctx => {
    if (!isOwner(ctx)) return;
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: "*Logs*\nNo logs implemented (dev only).",
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  });
};