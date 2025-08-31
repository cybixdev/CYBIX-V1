const fs = require('fs');
const path = require('path');
module.exports = (bot, sendBannerAndButtons, OWNER_ID) => {
  bot.command('statics', async ctx => {
    if (String(ctx.from.id) !== String(OWNER_ID)) return ctx.reply('❌ Only the owner!');
    let users = [];
    let groups = [];
    try { users = JSON.parse(fs.readFileSync(path.join(__dirname, '../utils/users.json'))); } catch { users = []; }
    try { groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../utils/groups.json'))); } catch { groups = []; }
    await sendBannerAndButtons(ctx, `📊 Statics:\nUsers: ${users.length}\nGroups: ${groups.length}`);
  });
};