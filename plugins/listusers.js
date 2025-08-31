const fs = require('fs');
const path = require('path');
module.exports = (bot, sendBannerAndButtons, OWNER_ID) => {
  bot.command('listusers', async ctx => {
    if (String(ctx.from.id) !== String(OWNER_ID)) return ctx.reply('❌ Only the owner!');
    let users = [];
    try { users = JSON.parse(fs.readFileSync(path.join(__dirname, '../utils/users.json'))); } catch { users = []; }
    await sendBannerAndButtons(ctx, `👥 Users (${users.length}):\n${users.map(u => u.username || u.id).join('\n')}`);
  });
};