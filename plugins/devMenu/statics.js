const { getBannerAndButtons } = require('../../utils');
const os = require('os');
module.exports = bot => {
  bot.hears(/^(\.|\/)statics\s*$/i, async ctx => {
    const cpus = os.cpus().length;
    const mem = (os.totalmem() / 1024 / 1024).toFixed(0) + "MB";
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: `*Statics*\nCPU Cores: ${cpus}\nTotal Mem: ${mem}`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  });
};