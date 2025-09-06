const { isOwner } = require('../../utils');
const { writeConfig } = require('../../config');
module.exports = bot => {
  bot.hears(/^(\.|\/)setbanner\s+(.+)/i, async ctx => {
    if (!isOwner(ctx)) return;
    const url = ctx.match[2];
    writeConfig({ banner: url });
    await ctx.reply("Banner updated.");
  });
};