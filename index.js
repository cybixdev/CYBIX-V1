require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const PORT = process.env.PORT || 3000; // For Render/Termux port listening

if (!BOT_TOKEN) throw new Error('BOT_TOKEN not set in .env');
if (!OWNER_ID) throw new Error('OWNER_ID not set in .env');

const bot = new Telegraf(BOT_TOKEN);

const BANNER_URL = 'https://files.catbox.moe/kdu5s1.jpg';
const WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X';
const TELEGRAM_CHANNEL = 'https://t.me/cybixtech';

function markupButtons() {
  return Markup.inlineKeyboard([
    [Markup.button.url('📲 Whatsapp Channel', WHATSAPP_CHANNEL)],
    [Markup.button.url('🚀 Telegram Channel', TELEGRAM_CHANNEL)],
  ]);
}

async function sendBanner(ctx, caption, extra = {}) {
  try {
    await ctx.replyWithPhoto({ url: BANNER_URL },
    {
      caption,
      ...extra,
      ...markupButtons(),
    });
  } catch (err) {
    await ctx.reply(caption, markupButtons());
  }
}

// Plugin auto-loader (plugins will be added later)
function loadPlugins(bot) {
  const pluginsPath = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginsPath)) return;
  
  function walk(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith('.js')) {
        require(fullPath)(bot, sendBanner, OWNER_ID);
      }
    });
  }
  walk(pluginsPath);
}
loadPlugins(bot);

// Full menu command
bot.command('menu', async (ctx) => {
  const now = new Date();
  const user = ctx.from.username ? '@' + ctx.from.username : ctx.from.first_name;
  const uptime = process.uptime().toFixed(0) + 's';
  const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + 'MB';
  const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + 'MB';
  let ip = 'N/A';
  try { ip = (await axios.get('https://api.ipify.org?format=json')).data.ip; } catch {}
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
  
  const menuText = `
╭━━〔 QUEEN-NOMI V1 〕━━╮
│ ✦ Prefix : .
│ ✦ Owner : @cybixdev
│ ✦ User : ${user}
│ ✦ Plugins: ${pluginsCount}
│ ✦ Version : 1.0.0
│ ✦ Uptime : ${uptime}
│ ✦ Time Now : ${now.toISOString().slice(11, 19)}
│ ✦ Date Today : ${now.toISOString().slice(0, 10)}
│ ✦ Time Zone : UTC
│ ✦ Server RAM : ${ram}
│ ✦ IP Address : ${ip}
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
  await sendBanner(ctx, menuText);
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('🚫 Oops! Something went wrong. Please try again.');
});

bot.launch();
console.log('QUEEN-NOMI V1 Bot started!');

if (process.env.RENDER || process.env.PORT) {
  require('http')
    .createServer((req, res) => res.end('QUEEN-NOMI V1 running.'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));