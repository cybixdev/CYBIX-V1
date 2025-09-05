const fs = require('fs');
const path = require('path');

module.exports = function(bot, config) {
  bot.command('logs', async ctx => {
    try {
      const logPath = path.join(__dirname, '../../', 'logs.txt');
      if (!fs.existsSync(logPath)) return ctx.reply('No logs found.');
      const logs = fs.readFileSync(logPath, 'utf8');
      await ctx.replyWithPhoto(
        await config.getBanner(),
        {
          caption: `📑 Logs:\n${logs.slice(-4000) || 'No logs found.'}`, // Only send last 4000 chars to avoid Telegram limit
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Telegram Channel", url: "https://t.me/cybixtech" },
                { text: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" }
              ]
            ]
          }
        }
      );
    } catch (e) {
      await ctx.reply('Failed to fetch logs.');
    }
  });
};