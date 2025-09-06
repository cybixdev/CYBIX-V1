const fs = require('fs');
const path = require('path');
const { getBannerAndButtons, isOwner } = require('../../utils');
module.exports = bot => {
  bot.hears(/^(\.|\/)listusers\s*$/i, async ctx => {
    if (!isOwner(ctx)) return;
    const usersFile = path.join(__dirname, '../../users.json');
    const users = fs.existsSync(usersFile) ? JSON.parse(fs.readFileSync(usersFile, 'utf8')) : [];
    const { photo, buttons } = getBannerAndButtons();
    const list = users.map(u => `${u.name} (${u.id})`).join('\n') || "No users found.";
    await ctx.replyWithPhoto({ url: photo }, {
      caption: `*User List*\n${list}`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  });
};