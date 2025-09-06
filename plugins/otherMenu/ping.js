const { getBannerAndButtons } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)ping\s*$/i, async ctx => {
    const start = Date.now();
    const sent = await ctx.reply('Pinging...');
    const ms = Date.now() - start;
    await ctx.deleteMessage(sent.message_id).catch(() => {});
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: `*Ping*: ${ms}ms`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  });
};