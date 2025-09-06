require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Config
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const BOT_VERSION = '1.0.0';
const BANNER_URL = 'https://files.catbox.moe/8l5mky.jpg';
const TG_CHANNEL = 'https://t.me/cybixtech';
const WA_CHANNEL = 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X';
let PREFIXES = ['.', '/'];

if (!BOT_TOKEN || !OWNER_ID) throw new Error('Set BOT_TOKEN and OWNER_ID in .env');

const bot = new Telegraf(BOT_TOKEN);

// User db
const userDBPath = path.join(__dirname, 'users.json');
let users = [];
if (fs.existsSync(userDBPath)) {
  try { users = JSON.parse(fs.readFileSync(userDBPath, 'utf8')); } catch (_) { users = []; }
}
function saveUsers() { fs.writeFileSync(userDBPath, JSON.stringify(users)); }
function registerUser(ctx) {
  if (ctx.from && !users.some(u => u.id === ctx.from.id)) {
    users.push({ id: ctx.from.id, name: ctx.from.username || ctx.from.first_name });
    saveUsers();
  }
}

// Banner reply
const channelButtons = Markup.inlineKeyboard([
  [Markup.button.url('📢 Telegram Channel', TG_CHANNEL)],
  [Markup.button.url('🟢 WhatsApp Channel', WA_CHANNEL)]
]);
async function sendBanner(ctx, text, extra = {}) {
  try {
    await ctx.replyWithPhoto({ url: BANNER_URL }, {
      caption: text,
      ...channelButtons,
      ...extra
    });
  } catch (_) {
    try { await ctx.reply(text, { ...channelButtons, ...extra }); } catch (_) {}
  }
}

// Menu
function getMenu(ctx) {
  const now = new Date();
  let uname = ctx.from?.username || ctx.from?.first_name || "Unknown";
  let uid = ctx.from?.id || "";
  let pluginsList = [
    "• chatgpt", "• gemini", "• deepseek", "• apk", "• spotify", "• gitclone", "• play", "• gdrive",
    "• repo", "• ping", "• runtime", "• xvideosearch", "• xnxxsearch", "• dl-xnxxvid", "• dl-xvideo",
    "• statics", "• listusers"
  ];
  return `
╭━───〔 𝐂𝐘𝐁𝐈𝐗 𝐕1 〕───━━╮
│ ✦ ᴘʀᴇғɪx : ${PREFIXES.join(' ')}
│ ✦ ᴏᴡɴᴇʀ : ${OWNER_ID}
│ ✦ ᴜsᴇʀ : ${uname}
│ ✦ ᴜsᴇʀ ɪᴅ : ${uid}
│ ✦ ᴜsᴇʀs : ${users.length}
│ ✦ sᴘᴇᴇᴅ : ${Date.now() - ctx.message.date * 1000}ms
│ ✦ sᴛᴀᴛᴜs : Online
│ ✦ ᴘʟᴜɢɪɴs : ${pluginsList.length}
│ ✦ ᴠᴇʀsɪᴏɴ : ${BOT_VERSION}
│ ✦ ᴛɪᴍᴇ ɴᴏᴡ : ${now.toLocaleTimeString()}
│ ✦ ᴅᴀᴛᴇ ɴᴏᴡ : ${now.toLocaleDateString()}
│ ✦ ᴍᴇᴍᴏʀʏ : ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB
╰───────────────────╯
╭━━【 𝐀𝐈 𝐌𝐄𝐍𝐔 】━━
┃ • ᴄʜᴀᴛɢᴘᴛ
┃ • ɢᴇᴍɪɴɪ
┃ • ᴅᴇᴇᴘsᴇᴇᴋ
╰━━━━━━━━━━━━━━━
╭━━【 𝐃𝐋 𝐌𝐄𝐍𝐔 】━━
┃ • ᴀᴘᴋ
┃ • sᴘᴏᴛɪғʏ
┃ • ɢɪᴛᴄʟᴏɴE
┃ • ᴘʟᴀʏ
┃ • ɢᴅʀɪᴠᴇ
╰━━━━━━━━━━━━━━━
╭━━【 𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔 】━━
┃ • ʀᴇᴘᴏ
┃ • ᴘɪɴɢ
┃ • ʀᴜɴᴛɪᴍᴇ
╰━━━━━━━━━━━━━━━
╭━━【 𝐀𝐃𝐔𝐋𝐓 𝐌𝐄𝐍𝐔 】━━
┃ • xᴠɪᴅᴇᴏsᴇᴀʀᴄʜ
┃ • xɴxxsᴇᴀʀᴄʜ
┃ • ᴅʟ-xɴxxᴠɪᴅ
┃ • ᴅʟ-xᴠɪᴅᴇᴏ
╰━━━━━━━━━━━━━━━
╭━━【𝐃𝐄𝐕 𝐌𝐄𝐍𝐔】━━
┃ • sᴛᴀᴛɪᴄs
┃ • ʟɪsᴛᴜsᴇʀs
╰━━━━━━━━━━━━━━━

ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐂𝐘𝐁𝐈𝐗 𝐃𝐄𝐕𝐒
`.trim();
}

// Command parser
function parseCommand(text) {
  for (const prefix of PREFIXES) {
    if (text.startsWith(prefix)) {
      const [cmd, ...args] = text.slice(prefix.length).trim().split(/\s+/);
      return { cmd: cmd.toLowerCase(), args };
    }
  }
  return null;
}

// Prefix setter
bot.hears(/^([./])setprefix\s+(.+)/i, async (ctx) => {
  if (ctx.from.id.toString() !== OWNER_ID) return;
  let newPrefixes = ctx.match[2].split(/\s+/).filter(Boolean);
  if (!newPrefixes.length) return sendBanner(ctx, '❌ Provide at least one prefix.');
  PREFIXES = newPrefixes;
  await sendBanner(ctx, `✅ Prefix changed to: ${PREFIXES.join(' ')}`);
});

// Menu/start triggers
const menuRegexes = [/^\/menu/i, /^\.menu/i, /^\/start/i, /^\.start/i, /^\/bot/i];
for (const regex of menuRegexes) {
  bot.hears(regex, async (ctx) => {
    registerUser(ctx);
    await sendBanner(ctx, getMenu(ctx));
  });
}

// Robust API response field parser
function getApiText(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data.result === "string") return data.result;
  if (typeof data.answer === "string") return data.answer;
  if (typeof data.text === "string") return data.text;
  if (Array.isArray(data.result) && typeof data.result[0] === "string") return data.result.join('\n');
  if (Array.isArray(data.result) && typeof data.result[0] === "object") {
    return data.result.map(x => x.url || x.title || JSON.stringify(x)).join('\n');
  }
  if (typeof data.result === "object") {
    let txt = "";
    for (const k in data.result) {
      if (typeof data.result[k] === "string") txt += `${k}: ${data.result[k]}\n`;
      else if (typeof data.result[k] === "object" && data.result[k].url) txt += `${k}: ${data.result[k].url}\n`;
    }
    if (txt) return txt.trim();
  }
  return JSON.stringify(data, null, 2);
}

// Plugin handler
async function handleCommand(ctx, { cmd, args }) {
  switch (cmd) {
    case 'ping':
      return await sendBanner(ctx, `🏓 Pong!\nSpeed: ${Date.now() - ctx.message.date * 1000}ms`);
    case 'repo':
      return await sendBanner(ctx, `🔗 [GitHub Repo](https://github.com/Mydie414/CYBIX)\n\nPowered by CYBIX Devs.`);
    case 'runtime':
      return await sendBanner(ctx, `⏱ Runtime: ${((process.uptime() / 60) | 0)}m ${(process.uptime() % 60 | 0)}s\nMemory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB`);
    case 'statics':
      return await sendBanner(ctx, `📊 Static Info:\nTotal Users: ${users.length}\nVersion: ${BOT_VERSION}\nOnline: CYBIX`);
    case 'listusers':
      return await sendBanner(ctx, '👥 Users:\n' + users.map(u => `${u.name} (${u.id})`).join('\n'));
    case 'chatgpt':
      if (!args.length) return await sendBanner(ctx, 'Usage: .chatgpt <prompt>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/ai/gpt?apikey=prince&q=${encodeURIComponent(args.join(' '))}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `🤖 ChatGPT:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ ChatGPT API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'gemini':
      if (!args.length) return await sendBanner(ctx, 'Usage: .gemini <prompt>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/ai/geminiaipro?apikey=prince&q=${encodeURIComponent(args.join(' '))}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `🌈 Gemini:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ Gemini API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'deepseek':
      if (!args.length) return await sendBanner(ctx, 'Usage: .deepseek <prompt>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/ai/deepseek-v3?apikey=prince&q=${encodeURIComponent(args.join(' '))}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `💡 Deepseek:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ Deepseek API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'apk':
      if (!args.length) return await sendBanner(ctx, 'Usage: .apk <app name>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=${encodeURIComponent(args.join(' '))}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `📦 APK:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ APK API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'spotify':
      if (!args.length) return await sendBanner(ctx, 'Usage: .spotify <url>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/download/spotifydlv2?apikey=prince&url=${encodeURIComponent(args[0])}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `🎵 Spotify:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ Spotify API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'gitclone':
      if (!args.length) return await sendBanner(ctx, 'Usage: .gitclone <github url>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/download/gitclone?apikey=prince&url=${encodeURIComponent(args[0])}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `🗃 GitClone:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ GitClone API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'play':
      if (!args.length) return await sendBanner(ctx, 'Usage: .play <youtube url>');
      try {
        let yturl = args[0];
        let { data } = await axios.get(`https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=${encodeURIComponent(yturl)}`);
        if (data.result && data.result.audio) {
          await ctx.replyWithAudio({ url: data.result.audio }, { title: data.result.title, ...channelButtons });
          return true;
        }
        let ans = getApiText(data);
        return await sendBanner(ctx, `🎶 Play:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ Play API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'gdrive':
      if (!args.length) return await sendBanner(ctx, 'Usage: .gdrive <gdrive url>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/download/gdrivedl?apikey=prince&url=${encodeURIComponent(args[0])}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `🗂 Google Drive:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ GDrive API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'xvideosearch':
      if (!args.length) return await sendBanner(ctx, 'Usage: .xvideosearch <query>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/search/xvideossearch?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `🔞 Xvideos Search:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ Xvideos API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'xnxxsearch':
      if (!args.length) return await sendBanner(ctx, 'Usage: .xnxxsearch <query>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/search/xnxxsearch?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `🔞 XNXX Search:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ XNXX API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'dl-xnxxvid':
      if (!args.length) return await sendBanner(ctx, 'Usage: .dl-xnxxvid <xnxx url>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/download/xnxxdl?apikey=prince&url=${encodeURIComponent(args[0])}`);
        if (data.result && data.result.url) {
          await ctx.replyWithVideo({ url: data.result.url }, { ...channelButtons });
          return true;
        }
        let ans = getApiText(data);
        return await sendBanner(ctx, `🔞 DL-XNXX:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ XNXXDL API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'dl-xvideo':
      if (!args.length) return await sendBanner(ctx, 'Usage: .dl-xvideo <xvideos url>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/download/xvideosdl?apikey=prince&url=${encodeURIComponent(args[0])}`);
        if (data.result && data.result.url) {
          await ctx.replyWithVideo({ url: data.result.url }, { ...channelButtons });
          return true;
        }
        let ans = getApiText(data);
        return await sendBanner(ctx, `🔞 DL-XVideo:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ XVideosDL API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'lyrics':
      if (!args.length) return await sendBanner(ctx, 'Usage: .lyrics <song>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/search/lyrics?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `🎵 Lyrics:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ Lyrics API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'wallpaper':
      if (!args.length) return await sendBanner(ctx, 'Usage: .wallpaper <query>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/search/wallpaper?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
        let img = (data.result && data.result[0] && data.result[0].url) || "";
        if (img) {
          await ctx.replyWithPhoto({ url: img }, { caption: '🖼 Wallpaper', ...channelButtons });
          return true;
        }
        let ans = getApiText(data);
        return await sendBanner(ctx, `🖼 Wallpaper:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ Wallpaper API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'weather':
      if (!args.length) return await sendBanner(ctx, 'Usage: .weather <location>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/search/weather?apikey=prince&location=${encodeURIComponent(args.join(' '))}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `🌦️ Weather:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ Weather API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'text2img':
      if (!args.length) return await sendBanner(ctx, 'Usage: .text2img <prompt>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/ai/text2img?apikey=prince&prompt=${encodeURIComponent(args.join(' '))}`);
        let img = (data.result && data.result.url) || "";
        if (img) {
          await ctx.replyWithPhoto({ url: img }, { caption: '🎨 AI Image', ...channelButtons });
          return true;
        }
        let ans = getApiText(data);
        return await sendBanner(ctx, `🎨 AI Image:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ Text2Img API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'yts':
      if (!args.length) return await sendBanner(ctx, 'Usage: .yts <query>');
      try {
        let { data } = await axios.get(`https://api.princetechn.com/api/search/yts?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
        let ans = getApiText(data);
        return await sendBanner(ctx, `🎬 YTS Results:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ YTS API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    default: return false;
  }
}

// Main message handler: only respond if menu trigger or valid prefix+command!
bot.on('text', async (ctx, next) => {
  try {
    registerUser(ctx);
    // Only respond to valid prefix+command:
    const command = parseCommand(ctx.message.text);
    if (command) {
      let handled = await handleCommand(ctx, command);
      // If handled, DO NOT send the menu. If not handled, DO NOTHING.
      return;
    }
    // else: do NOT reply!!
  } catch (_) {}
  await next();
});

// Fallback: do not respond to anything else (no menu, no spam)

// Keepalive HTTP Server for Render/Termux
require('http').createServer((_, res) => res.end('Bot is running')).listen(process.env.PORT || 3000);

// Start
bot.launch()
  .then(() => console.log('CYBIX BOT started.'))
  .catch(err => { console.error('Failed to start bot:', err); process.exit(1); });
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));