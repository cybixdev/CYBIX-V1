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
function formatMemory(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function formatUptime() {
  let sec = process.uptime() | 0;
  let [h, m, s] = [
    Math.floor(sec / 3600),
    Math.floor((sec % 3600) / 60),
    sec % 60
  ];
  return `${h}h ${m}m ${s}s`;
}
function getCPU() {
  const cpus = os.cpus();
  return cpus && cpus.length ? `${cpus[0].model} (${cpus.length} cores)` : "Unknown";
}
function getPlatform() {
  return `${os.platform()} ${os.arch()} (${os.hostname()})`;
}
function getHost() {
  return os.hostname();
}
function getLoad() {
  return os.loadavg().map(l => l.toFixed(2)).join(' / ');
}
function getFreeMem() {
  return `${(os.freemem()/1024/1024).toFixed(2)} MB`;
}
function getTotalMem() {
  return `${(os.totalmem()/1024/1024).toFixed(2)} MB`;
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

// --- Dynamic Menu Loader ---
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
    const cpu = getCPU();
    const platform = getPlatform();
    const host = getHost();
    const load = getLoad();
    const freeMem = getFreeMem();
    const totalMem = getTotalMem();

    let menuText =
`╭━━━[ 𝐂𝐘𝐁𝐈𝐗 𝐕1 ]━━━
┃ 👤 User: ${user.username ? '@' + user.username : user.first_name}
┃ 🆔 ID: ${user.id}
┃ 👑 Owner: @cybixdev
┃ 🧑‍💻 Developer: ${DEVELOPER}
┃ 🕒 Uptime: ${formatUptime()}
┃ 💾 Memory: ${formatMemory(mem.rss)} / ${totalMem} (free: ${freeMem})
┃ ⚙️ Plugins Loaded: ${pluginCount}
┃ 🖥️ Platform: ${platform}
┃ 🧠 CPU: ${cpu}
┃ 🏠 Host: ${host}
┃ 📊 Load: ${load}
┃ 🔥 Runtime: Node.js ${process.version}
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
      BANNER,
      {
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      }
    );

    await ctx.reply(menuText, { parse_mode: 'Markdown' });

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
  await ctx.replyWithPhoto(
    BANNER,
    {
      caption: '❌ Unknown command. Type .menu or /menu to see available commands.',
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    }
  );
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