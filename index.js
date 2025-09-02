const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const os = require('os');
require('dotenv').config();

const BOT_OWNER = process.env.BOT_OWNER || '@cybixdev';
const BOT_VERSION = '2.1.0';

const bot = new Telegraf(process.env.BOT_TOKEN, { handlerTimeout: 15000 });

const prefixRegex = /^([./])(menu|start)$/i;

// Utility functions
const formatUptime = () => {
  const seconds = process.uptime();
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
};
const formatMemory = (rss) => `${(rss / 1024 / 1024).toFixed(2)} MB`;
const pluginCount = () => {
  let total = 0;
  ['plugin/aiMenu', 'plugin/adultMenu', 'plugin/hentaiMenu', 'plugin/devMenu'].forEach(dir => {
    total += fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.js')).length : 0;
  });
  return total;
};
const serverInfo = () => `${os.platform()} ${os.arch()} (${os.hostname()}) PID:${process.pid}`;

// Load all command files
const loadCommands = (dir) => {
  return fs.existsSync(dir) ?
    fs.readdirSync(dir)
    .filter(f => f.endsWith('.js'))
    .map(f => require('./' + dir + '/' + f)) :
    [];
};
const aiCommands = loadCommands('plugin/aiMenu');
const adultCommands = loadCommands('plugin/adultMenu');
const hentaiCommands = loadCommands('plugin/hentaiMenu');
const devCommands = loadCommands('plugin/devMenu');

// Banner (ASCII Art)
const BANNER = `
╔════════════════════════════════════╗
║      CYBIX V2 TELEGRAM BOT        ║
║     The most dope AI/NSFW bot!    ║
╚════════════════════════════════════╝
`;

// Menu caption generator
function getMenuCaption(user, mem) {
  return `${BANNER}
╭━━━[ MAIN MENU ]━━━
┃ 👤 User: ${user.username ? '@' + user.username : user.first_name}
┃ 🆔 ID: ${user.id}
┃ 👑 Owner: ${BOT_OWNER}
┃ 💾 Memory: ${formatMemory(mem.rss)}
┃ 🕒 Uptime: ${formatUptime()}
┃ ⚙️ Plugins: ${pluginCount()}
┃ 🔖 Bot Version: ${BOT_VERSION}
┃ 🖥️ Server: ${serverInfo()}
┃ ⏳ Prefix: . or /
┃ 🛠️ Use buttons below or type .menu /menu /start
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━[ AI MENU (${aiCommands.length}) ]━╮
${aiCommands.map(cmd => `┃ • ${cmd.example} — ${cmd.desc}`).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━[ ADULT MENU (${adultCommands.length}) ]━╮
${adultCommands.map(cmd => `┃ • ${cmd.example} — ${cmd.desc}`).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━[ HENTAI MENU (${hentaiCommands.length}) ]━╮
${hentaiCommands.map(cmd => `┃ • ${cmd.example} — ${cmd.desc}`).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━[ DEV MENU (${devCommands.length}) OWNER ONLY ]━╮
${devCommands.map(cmd => `┃ • ${cmd.example} — ${cmd.desc}`).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━━

╭━━[ EXTRA ]━━
┃ Prefix: . or /
┃ Use menu buttons or type .menu /menu /start.
┃ All commands work with both prefixes!
┃ Contact owner for bugs.
╰━━━━━━━━━━━━━━━━━━━━━━━`;
}

// Buttons for menu navigation
const menuButtons = Markup.inlineKeyboard([
  [Markup.button.callback('AI MENU', 'ai_menu'), Markup.button.callback('ADULT MENU', 'adult_menu')],
  [Markup.button.callback('HENTAI MENU', 'hentai_menu'), Markup.button.callback('DEV MENU', 'dev_menu')],
  [Markup.button.callback('MAIN MENU', 'main_menu')]
]);

// Send main menu
async function sendMenu(ctx) {
  const mem = process.memoryUsage();
  await ctx.reply(getMenuCaption(ctx.from, mem), menuButtons);
}

// Button handlers for menu navigation
bot.action('main_menu', async ctx => {
  await ctx.editMessageText(getMenuCaption(ctx.from, process.memoryUsage()), menuButtons);
});
bot.action('ai_menu', async ctx => {
  await ctx.editMessageText(
    `${BANNER}\n╭━[ AI MENU (${aiCommands.length}) ]━╮\n${aiCommands.map(cmd => `┃ • ${cmd.example} — ${cmd.desc}`).join('\n')}\n╰━━━━━━━━━━━━━━━━━━━━━━━`,
    menuButtons
  );
});
bot.action('adult_menu', async ctx => {
  await ctx.editMessageText(
    `${BANNER}\n╭━[ ADULT MENU (${adultCommands.length}) ]━╮\n${adultCommands.map(cmd => `┃ • ${cmd.example} — ${cmd.desc}`).join('\n')}\n╰━━━━━━━━━━━━━━━━━━━━━━━`,
    menuButtons
  );
});
bot.action('hentai_menu', async ctx => {
  await ctx.editMessageText(
    `${BANNER}\n╭━[ HENTAI MENU (${hentaiCommands.length}) ]━╮\n${hentaiCommands.map(cmd => `┃ • ${cmd.example} — ${cmd.desc}`).join('\n')}\n╰━━━━━━━━━━━━━━━━━━━━━━━`,
    menuButtons
  );
});
bot.action('dev_menu', async ctx => {
  await ctx.editMessageText(
    `${BANNER}\n╭━[ DEV MENU (${devCommands.length}) OWNER ONLY ]━╮\n${devCommands.map(cmd => `┃ • ${cmd.example} — ${cmd.desc}`).join('\n')}\n╰━━━━━━━━━━━━━━━━━━━━━━━`,
    menuButtons
  );
});

// Menu triggers
bot.hears(prefixRegex, async ctx => await sendMenu(ctx));

// Individual commands
[...aiCommands, ...adultCommands, ...hentaiCommands, ...devCommands].forEach(cmd => {
  bot.hears(new RegExp(`^([./])${cmd.name}(\\s+.*)?$`, 'i'), async ctx => {
    try {
      await cmd.run(ctx);
    } catch (e) {
      await ctx.reply(`❌ Error: ${e.message}`);
    }
  });
});

// Unknown command fallback
bot.on('text', async ctx => {
  if (/^([./])/.test(ctx.message.text)) {
    await ctx.reply('❓ Unknown command! Type .menu or /menu for help.');
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('⚠️ An error occurred!');
});

bot.launch();
console.log('CYBIX V2 BOT ONLINE!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));