const fs = require('fs');
const path = require('path');
module.exports = (bot, sendBannerAndButtons, OWNER_ID) => {
  bot.command('logs', async ctx => {
    if (String(ctx.from.id) !== String(OWNER_ID)) return ctx.reply('❌ Only the owner!');
    let logs = '';
    try {
      logs = fs.readFileSync(path.join(__dirname, '../utils/logs.txt'), 'utf-8').split('\n').slice(-10).join('\n');
    } catch { logs = 'No logs found.'; }
    await sendBannerAndButtons(ctx, `📝 Last 10 logs:\n${logs}`);
  });
};