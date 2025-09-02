require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID || "0";
const DEVELOPER = process.env.DEVELOPER || "@cybixdev";
const PORT = process.env.PORT || 3000;
const BANNER = 'https://i.imgur.com/X34jPIr.jpeg';

const CHANNEL_BUTTONS = [
  [Markup.button.url('Whatsapp Channel', 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X')],
  [Markup.button.url('Telegram Channel', 'https://t.me/cybixtech')],
  [Markup.button.url('Github Repo', 'https://github.com/hacknetmo')]
];

if (!BOT_TOKEN || !OWNER_ID || OWNER_ID === "0") {
  console.error('❌ BOT_TOKEN or OWNER_ID missing in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// --- Helper Functions ---
function formatMemoryShort(bytes) {
  let mb = (bytes / 1024 / 1024).toFixed(1);
  return (mb.length <= 10 ? mb : mb.slice(0, 10)) + ' MB';
}
function formatUptimeShort() {
  let sec = process.uptime() | 0;
  let h = Math.floor(sec / 3600);
  let m = Math.floor((sec % 3600) / 60);
  let s = sec % 60;
  let out = `${h}h${m}m${s}s`;
  return out.length <= 10 ? out : out.slice(0, 10);
}
function getCPUPercent() {
  const loads = os.loadavg();
  const cpuCount = os.cpus().length;
  let percent = ((loads[0] / cpuCount) * 100).toFixed(1);
  return (percent.length <= 10 ? percent : percent.slice(0, 10)) + '%';
}
function getHostShort() {
  const host = os.hostname();
  return host.length <= 10 ? host : host.slice(0, 10);
}
function getPlatformShort() {
  const platform = os.platform();
  return platform.length <= 10 ? platform : platform.slice(0, 10);
}
function countPlugins(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    if (entry.isDirectory()) count += countPlugins(path.join(dir, entry.name));
    else if (entry.isFile() && entry.name.endsWith('.js')) count++;
  });
  return count;
}
function getMenuSection(menuName, pluginDir) {
  const files = fs.existsSync(pluginDir) ? fs.readdirSync(pluginDir).filter(f => f.endsWith('.js')) : [];
  const commands = files.map(f => {
    try {
      const plugin = require(path.join(pluginDir, f));
      return plugin && plugin.example ? plugin.example : `.${f.replace('.js','')}`;
    } catch {
      return `.${f.replace('.js','')}`;
    }
  });
  return { menuName, commands };
}

// --- Menu Sections ---
const MENU_SECTIONS = [
  getMenuSection('AI MENU', path.join(__dirname, 'plugins/aiMenu')),
  getMenuSection('DOWNLOAD MENU', path.join(__dirname, 'plugins/downloadMenu')),
  getMenuSection('NSFW MENU', path.join(__dirname, 'plugins/nsfwMenu')),
  getMenuSection('PORN MENU', path.join(__dirname, 'plugins/pornMenu')),
  getMenuSection('HENTAI MENU', path.join(__dirname, 'plugins/hentaiMenu')),
  getMenuSection('FUN MENU', path.join(__dirname, 'plugins/funMenu')),
  getMenuSection('TOOLS MENU', path.join(__dirname, 'plugins/toolsMenu')),
  getMenuSection('CONVERT MENU', path.join(__dirname, 'plugins/convertMenu')),
  getMenuSection('OTHER MENU', path.join(__dirname, 'plugins/otherMenu')),
  getMenuSection('ADMIN MENU', path.join(__dirname, 'plugins/adminMenu')),
  getMenuSection('DEVELOPER MENU', path.join(__dirname, 'plugins/devMenu'))
];

// ---- MAIN MENU HANDLER ----
async function sendMenu(ctx) {
  try {
    const user = ctx.from;
    const mem = process.memoryUsage();
    const pluginCount = countPlugins(path.join(__dirname, 'plugins'));
    const cpuPercent = getCPUPercent();
    const platform = getPlatformShort();
    const host = getHostShort();
    const uptime = formatUptimeShort();
    const memory = formatMemoryShort(mem.rss);

    let menuText =
`╭━━━[ CYBIX V1 MENU ]━━━
┃ 👤 User: ${user.username ? '@' + user.username : user.first_name}
┃ 🆔 ID: ${user.id}
┃ 👑 Owner: @cybixdev
┃ 🧑‍💻 Dev: ${DEVELOPER}
┃ 🕒 Up: ${uptime}
┃ 💾 Mem: ${memory}
┃ ⚙️ Plugins: ${pluginCount}
┃ 🖥️ Plat: ${platform}
┃ 🧠 CPU: ${cpuPercent}
┃ 🏠 Host: ${host}
┃ ⏳ Prefix: . or /
┃ 📅 Date: ${new Date().toLocaleString()}
╰━━━━━━━━━━━━━━━
`;

    for (const section of MENU_SECTIONS) {
      if (section.commands.length) {
        menuText += `\n╭━━【 ${section.menuName} 】━━\n`;
        menuText += section.commands.map(cmd => `┃ • ${cmd}`).join('\n');
        menuText += `\n╰━━━━━━━━━━━━━━━\n`;
      }
    }

    menuText += `
▣ Powered by *CYBIX TECH* 👹💀`;

    await ctx.replyWithPhoto(
      { url: BANNER },
      {
        caption: menuText,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      }
    );
  } catch (e) {
    await ctx.reply("❌ Error displaying menu: " + e.message);
  }
}

// --- Menu Command Triggers ---
bot.command(['start', 'menu'], sendMenu);
bot.hears(/^\.start$/i, sendMenu);
bot.hears(/^\.menu$/i, sendMenu);

// --- Fallback for Unknown Dot Commands ---
bot.on('text', async ctx => {
  if (!ctx.message.text.startsWith('.')) return;
  await sendMenu(ctx);
});

// --- Error Handling ---
bot.catch((err, ctx) => {
  console.error(`[CYBIX] Error for ${ctx && ctx.updateType ? ctx.updateType : "unknown context"}`, err);
});

// --- Start Bot (PORT support for Render/Heroku and polling fallback) ---
(async () => {
  try {
    if (process.env.WEBHOOK_URL) {
      await bot.launch({
        webhook: {
          domain: process.env.WEBHOOK_URL,
          port: PORT
        }
      });
      console.log(`CYBIX V1 started with Webhook! PORT: ${PORT}`);
    } else {
      await bot.launch();
      console.log('CYBIX V1 started with polling!');
    }
  } catch (e) {
    console.error('❌ Failed to launch bot:', e.message);
    process.exit(1);
  }
})();

// --- Graceful Shutdown ---
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));