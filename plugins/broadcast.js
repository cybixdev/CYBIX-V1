const fs = require('fs');
const path = require('path');
module.exports = (bot, sendBannerAndButtons, OWNER_ID) => {
  bot.command('broadcast', async ctx => {
    if (String(ctx.from.id) !== String(OWNER_ID)) return ctx.reply('❌ Only the owner can broadcast!');
    const msg = ctx.message.text.replace(/\/broadcast\s?/i, '').trim();
    if (!msg) return ctx.reply('Usage: /broadcast <message>');
    let users = [];
    try { users = JSON.parse(fs.readFileSync(path.join(__dirname, '../utils/users.json'))); } catch { users = []; }
    for (const u of users) {
      try {
        await bot.telegram.sendMessage(u.id, msg);
      } catch { /* skip errors */ }
    }
    await sendBannerAndButtons(ctx, `📢 Broadcast sent to ${users.length} users.`);
  });
};