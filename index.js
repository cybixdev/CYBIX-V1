require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const PORT = process.env.PORT || 3000;
const BANNER_URL = 'https://files.catbox.moe/kdu5s1.jpg';

if (!BOT_TOKEN) throw new Error('BOT_TOKEN not set in .env');
if (!OWNER_ID) throw new Error('OWNER_ID not set in .env');

const bot = new Telegraf(BOT_TOKEN);

function markupButtons() {
  return Markup.inlineKeyboard([
    [Markup.button.url('📲 Whatsapp Channel', 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X')],
    [Markup.button.url('🚀 Telegram Channel', 'https://t.me/cybixtech')],
    [Markup.button.url('👑 Developer', 'https://t.me/cybixdev')]
  ]);
}

function getBotVersion() {
  try {
    const pkg = require('./package.json');
    return pkg.version || 'unknown';
  } catch {
    return 'unknown';
  }
}

function getMenuText(ctx) {
  const now = new Date();
  const user = ctx.from.username ? '@' + ctx.from.username : ctx.from.first_name;
  const uptimeSec = process.uptime();
  const hours = Math.floor(uptimeSec / 3600);
  const minutes = Math.floor((uptimeSec % 3600) / 60);
  const seconds = Math.floor(uptimeSec % 60);
  const uptime = `${hours}h ${minutes}m ${seconds}s`;
  const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(1) + 'MB';
  const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + 'MB';
  let pluginsCount = 0;
  
  function countPlugins(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) countPlugins(fullPath);
      else if (file.endsWith('.js')) pluginsCount++;
    });
  }
  countPlugins(path.join(__dirname, 'plugins'));
  const version = getBotVersion();
  
  // This is your exact menu structure, unchanged, in list form.
  return `
╭━━〔 QUEEN-NOMI V${version} 〕━━╮
│ ✦ Prefix : . or /
│ ✦ Owner : @cybixdev
│ ✦ User : ${user}
│ ✦ Plugins: ${pluginsCount}
│ ✦ Version : ${version}
│ ✦ Uptime : ${uptime}
│ ✦ Time Now : ${now.toISOString().slice(11, 19)}
│ ✦ Date Today : ${now.toISOString().slice(0, 10)}
│ ✦ Time Zone : UTC
│ ✦ Server RAM : ${ram}
│ ✦ Memory : ${mem}
╰─────────────────────╯

╭━━【 MAIN MENU 】━━
┃ • .menu
╰━━━━━━━━━━━━━━━

╭━━【 AI MENU 】━━
┃ • .chatgpt
┃ • .deepseek
┃ • .blackbox
┃ • .bard
┃ • .llama
┃ • .gemini
┃ • .mixtral
┃ • .codegpt
┃ • .mistral
┃ • .suno
╰━━━━━━━━━━━━━━━

╭━━【 DOWNLOAD MENU 】━━
┃ • .apk
┃ • .play
┃ • .video
┃ • .gitclone
┃ • .instadl
┃ • .tiktokdl
┃ • .twimg
┃ • .fbvideo
┃ • .docdl
┃ • .wallpaper
╰━━━━━━━━━━━━━━━

╭━━【 NSFW MENU 】━━
┃ • .hentai
┃ • .lewd
┃ • .nsfwimg
┃ • .adultjoke
┃ • .boobs
┃ • .ass
┃ • .thighs
┃ • .ecchi
┃ • .yaoi
┃ • .yuri
┃ • .feet
┃ • .trap
┃ • .cum
┃ • .blowjob
┃ • .doujin
┃ • .gonewild
╰━━━━━━━━━━━━━━━

╭━━【 ADULT MENU 】━━
┃ • .pornvid
┃ • .pornimg
┃ • .moans
┃ • .sexaudio
┃ • .sexstory
┃ • .adultmp3
┃ • .adultgif
╰━━━━━━━━━━━━━━━

╭━━【 FUN MENU 】━━
┃ • .meme
┃ • .cat
┃ • .dog
┃ • .fox
┃ • .quote
┃ • .fact
┃ • .joke
┃ • .advice
┃ • .trivia
┃ • .anime
┃ • .waifu
┃ • .truth
┃ • .dare
╰━━━━━━━━━━━━━━━

╭━━【 OTHER MENU 】━━
┃ • .runtime
┃ • .ping
┃ • .buybot
┃ • .repo
┃ • .help
┃ • .profile
┃ • .support
╰━━━━━━━━━━━━━━━

╭━━【 EXTRA MENU 】━━
┃ • .iplookup
┃ • .randomfact
┃ • .animalfact
┃ • .math
┃ • .horoscope
┃ • .changelog
╰━━━━━━━━━━━━━━━

╭━━【 DEV MENU 】━━
┃ • .broadcast
┃ • .statics
┃ • .mode
┃ • .listusers
┃ • .logs
╰━━━━━━━━━━━━
`;
}

// Always send menu with banner (photo + text)
async function sendBanner(ctx, caption, extra = {}) {
  try {
    await ctx.replyWithPhoto({ url: BANNER_URL },
    {
      caption,
      ...extra,
      ...markupButtons(),
      parse_mode: undefined, // plain text for max compatibility
    });
  } catch (err) {
    await ctx.reply(caption, { ...markupButtons(), parse_mode: undefined });
  }
}

// Load plugins and pass sendBanner and OWNER_ID
function loadPlugins(bot) {
  const pluginsPath = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginsPath)) return;
  
  function walk(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
      else if (file.endsWith('.js')) {
        try {
          require(fullPath)(bot, sendBanner, OWNER_ID);
        } catch (e) {
          console.error(`Plugin error in ${fullPath}:`, e.message);
        }
      }
    });
  }
  walk(pluginsPath);
}
loadPlugins(bot);

// Menu handler
async function sendMenuWithBanner(ctx) {
  await sendBanner(ctx, getMenuText(ctx));
}

// Respond to .menu, /menu, and /start
bot.start(sendMenuWithBanner);
bot.hears(/^(\.menu|\/menu)$/i, sendMenuWithBanner);

// Error handler
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  try {
    ctx.reply('🚫 Oops! Something went wrong. Please try again.');
  } catch {}
});

// Launch and Web Server for Render
bot.launch().then(() => {
  console.log('QUEEN-NOMI V' + getBotVersion() + ' Bot started!');
}).catch((e) => {
  console.error('Bot failed to start:', e.message);
});

if (process.env.RENDER || process.env.PORT) {
  require('http')
    .createServer((req, res) => res.end('QUEEN-NOMI V1 running.'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));