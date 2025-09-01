require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID || "0";
const PORT = process.env.PORT || 3000;
const BANNER = 'https://i.postimg.cc/L4NwW5WY/boykaxd.jpg';

const CHANNEL_BUTTONS = [
  [Markup.button.url('Whatsapp Channel', 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X')],
  [Markup.button.url('Telegram Channel', 'https://t.me/cybixtech')]
];

if (!BOT_TOKEN || !OWNER_ID) {
  console.error('❌ BOT_TOKEN or OWNER_ID missing in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// --- Plugin Loader ---
function loadPlugins(pluginDir) {
  if (!fs.existsSync(pluginDir)) return;
  fs.readdirSync(pluginDir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(pluginDir, entry.name);
    if (entry.isDirectory()) {
      loadPlugins(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      try {
        const plugin = require(fullPath);
        if (typeof plugin === 'function') {
          plugin(bot, { OWNER_ID, BANNER, CHANNEL_BUTTONS });
        }
      } catch (e) {
        console.error(`❌ Error loading plugin ${fullPath}:`, e.message);
      }
    }
  });
}
loadPlugins(path.join(__dirname, 'plugins'));

// --- Helpers ---
function formatMemory(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
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
function countPlugins(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    if (entry.isDirectory()) count += countPlugins(path.join(dir, entry.name));
    else if (entry.isFile() && entry.name.endsWith('.js')) count++;
  });
  return count;
}

// ---- MAIN MENU HANDLER ----
async function sendMenu(ctx) {
  try {
    const user = ctx.from;
    const mem = process.memoryUsage();
    const pluginCount = countPlugins(path.join(__dirname, 'plugins'));

    // Build menu as a single caption string (user+memory+menu)
    const menuText =
`╭━━━[ 𝐂𝐘𝐁𝐈𝐗 𝐕1 MAIN MENU ]━━━
┃ 👤 User: ${user.username ? '@' + user.username : user.first_name}
┃ 🆔 ID: ${user.id}
┃ 👑 Owner: @cybixdev
┃ 🕒 Uptime: ${formatUptime()}
┃ 💾 Memory: ${formatMemory(mem.rss)}
┃ ⚙️ Plugins: ${pluginCount}
┃ ⏳ Prefix: .
╰━━━━━━━━━━━━━━━

╭━━【 AI MENU 】━━
┃ • .chatgpt
┃ • .deepseek
┃ • .blackbox
┃ • .bard
┃ • .phind
╰━━━━━━━━━━━━━━━

╭━━【 DOWNLOAD MENU 】━━
┃ • .apk
┃ • .play
┃ • .video
┃ • .gitclone
┃ • .instadl
┃ • .ytmp3
╰━━━━━━━━━━━━━━━

╭━━【 NSFW MENU 】━━
┃ • .nsfwpic
┃ • .nsfwgif
┃ • .4kporn
┃ • .ass
┃ • .boobs
┃ • .thighs
┃ • .cum
┃ • .lesbian
┃ • .milf
┃ • .blowjob
┃ • .bdsm
┃ • .pussy
┃ • .publicsex
┃ • .anal
┃ • .cumslut
┃ • .spank
┃ • .dick
┃ • .cosplay
┃ • .facesitting
┃ • .randomnsfw
╰━━━━━━━━━━━━━━━

╭━━【 PORN MENU 】━━
┃ • .xnxx
┃ • .pornhub
┃ • .redgifs
┃ • .lesbianporn
┃ • .triplelesbian
┃ • .gayporn
┃ • .asian
┃ • .ebony
┃ • .bear
┃ • .kissing
┃ • .futa
┃ • .celebrity
╰━━━━━━━━━━━━━━━

╭━━【 FUN MENU 】━━
┃ • .meme
┃ • .joke
┃ • .roast
┃ • .simi
┃ • .ship
┃ • .tictactoe
╰━━━━━━━━━━━━━━━

╭━━【 TOOLS MENU 】━━
┃ • .imgtourl
┃ • .qrgen
┃ • .shorturl
┃ • .tts
┃ • .weather
┃ • .translate
╰━━━━━━━━━━━━━━━

╭━━【 CONVERT MENU 】━━
┃ • .img2pdf
┃ • .pdf2img
┃ • .doc2pdf
┃ • .img2text
┃ • .video2mp3
╰━━━━━━━━━━━━━━━

╭━━【 OTHER MENU 】━━
┃ • .runtime
┃ • .ping
┃ • .developer
┃ • .buybot
┃ • .repo
╰━━━━━━━━━━━━━━━

╭━━【 DEVELOPER 】━━
┃ • .broadcast
┃ • .statics
┃ • .mode
┃ • .listusers
╰━━━━━━━━━━━━━━━

▣ Powered by *CYBIX TECH* 👹💀`;

    // If menuText is too long, Telegram will throw, and you will see an error in your logs.
    if (menuText.length > 2000) {
      await ctx.reply('❌ Menu too long for Telegram photo caption. Please shorten your menu or send it as a text message instead.');
      return;
    }

    await ctx.replyWithPhoto(
      BANNER,
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