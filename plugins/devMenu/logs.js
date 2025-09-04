module.exports = (bot, sendBanner, OWNER_ID) => {
  bot.hears(/^(\.logs|\/logs)$/i, async (ctx) => {
    if (String(ctx.from.id) !== OWNER_ID) {
      await sendBanner(ctx, "🚫 Only the owner can view logs.");
      return;
    }
    // For demo, just show last 10 lines of log.txt
    const fs = require('fs');
    let logs = "";
    if (fs.existsSync('./log.txt')) {
      const lines = fs.readFileSync('./log.txt', 'utf8').split('\n');
      logs = lines.slice(-10).join('\n');
    } else {
      logs = "No logs yet.";
    }
    await sendBanner(ctx, `📄 Last Logs:\n\n${logs}`);
  });
};