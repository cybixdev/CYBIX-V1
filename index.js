require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID || "0";
const BANNER = 'https://i.postimg.cc/L4NwW5WY/boykaxd.jpg';
const PORT = process.env.PORT || 3000;

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
  fs.readdirSync(pluginDir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(pluginDir, entry.name);
    if (entry.isDirectory()) {
      loadPlugins(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      const plugin = require(fullPath);
      if (typeof plugin === 'function') {
        try {
          plugin(bot, { OWNER_ID, BANNER, CHANNEL_BUTTONS });
        } catch (e) {
          console.error(`❌ Error loading plugin ${fullPath}:`, e.message);
        }
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
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    if (entry.isDirectory()) count += countPlugins(path.join(dir, entry.name));
    else if (entry.isFile() && entry.name.endsWith('.js')) count++;
  });
  return count;
}

// --- Main Menu Handler ---
async function sendMenu(ctx) {
  try {
    const user = ctx.from;
    const mem = process.memoryUsage();
    const pluginCount = countPlugins(path.join(__dirname, 'plugins'));
    const caption =
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

    await ctx.replyWithPhoto(
      { url: BANNER },
      {
        caption,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(CHANNEL_BUTTONS)
      }
    );
  } catch (e) {
    await ctx.reply('❌ Error displaying menu.');
  }
}

// --- Command Triggers ---
// Responds to both /start, .start, /menu, .menu
bot.command(['start', 'menu'], sendMenu);
bot.hears(/^\.menu$/i, sendMenu);
bot.hears(/^\.start$/i, sendMenu);

// --- Fallback for Unknown Commands ---
bot.on('text', async ctx => {
  if (!ctx.message.text.startsWith('.')) return;
  await ctx.replyWithPhoto(
    { url: BANNER },
    {
      caption: '❌ Unknown command. Type .menu or /menu to see all available commands.',
      ...Markup.inlineKeyboard(CHANNEL_BUTTONS)
    }
  );
});

// --- Error Handling ---
bot.catch((err, ctx) => {
  console.error(`[CYBIX] Error for ${ctx.updateType}`, err);
});

// --- Start Bot (with PORT support for Render/Heroku/etc) ---
(async () => {
  try {
    if (process.env.WEBHOOK_URL) {
      // For platforms requiring webhook (like Render, Vercel)
      bot.launch({
        webhook: {
          domain: process.env.WEBHOOK_URL,
          port: PORT
        }
      });
      console.log(`CYBIX V1 started with Webhook! PORT: ${PORT}`);
    } else {
      // Standard polling (Termux, localhost, etc)
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