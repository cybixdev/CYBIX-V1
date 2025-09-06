const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)repo\s*$/i, async ctx => {
    const repoUrl = "https://github.com/JadenAfrix1";
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: `*Bot Repo:*\n${repoUrl}`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  });
};