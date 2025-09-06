require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Config
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const BOT_VERSION = '1.0.4';
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

// Menu (ORIGINAL STRUCTURE ONLY, just append new menus below)
function getMenu(ctx) {
  const now = new Date();
  let uname = ctx.from?.username || ctx.from?.first_name || "Unknown";
  let uid = ctx.from?.id || "";
  let pluginsList = [
    "• chatgpt", "• gemini", "• deepseek", "• apk", "• spotify", "• gitclone", "• play", "• gdrive",
    "• repo", "• ping", "• runtime", "• xvideosearch", "• xnxxsearch", "• dl-xnxxvid", "• dl-xvideo",
    "• statics", "• listusers",
    // Hentai/NSFW/Porn/Fun/Dev/Tools plugins will be listed in their own menus below
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
│ ✦ ᴘʟᴜɢɪɴs : ${pluginsList.length + 24}
│ ✦ ᴠᴇʀsɪᴏɴ : ${BOT_VERSION}
│ ✦ ᴛɪᴍᴇ ɴᴏᴡ : ${now.toLocaleTimeString()}
│ ✦ ᴅᴀᴛᴇ ɴᴏᴡ : ${now.toLocaleDateString()}
│ ✦ ᴍᴇᴍᴏʀʏ : ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB
╰───────────────────╯
╭━━【 𝐀𝐈 𝐌𝐄𝐍𝐔 】━━
┃ • chatgpt
┃ • gemini
┃ • deepseek
╰━━━━━━━━━━━━━━━
╭━━【 𝐃𝐋 𝐌𝐄𝐍𝐔 】━━
┃ • apk
┃ • spotify
┃ • gitclone
┃ • play
┃ • gdrive
╰━━━━━━━━━━━━━━━
╭━━【 𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔 】━━
┃ • repo
┃ • ping
┃ • runtime
╰━━━━━━━━━━━━━━━
╭━━【 𝐀𝐃𝐔𝐋𝐓 𝐌𝐄𝐍𝐔 】━━
┃ • xvideosearch
┃ • xnxxsearch
┃ • dl-xnxxvid
┃ • dl-xvideo
╰━━━━━━━━━━━━━━━
╭━━【 𝐇𝐄𝐍𝐓𝐀𝐈 𝐌𝐄𝐍𝐔 】━━
┃ • hentai
┃ • waifu
┃ • blowjob
┃ • boobs
┃ • neko
┃ • trap
┃ • lewd
┃ • anal
┃ • cum
┃ • femdom
┃ • feet
┃ • solo
┃ • yuri
╰━━━━━━━━━━━━━━━
╭━━【 𝐍𝐒𝐅𝐖 𝐌𝐄𝐍𝐔 】━━
┃ • nsfwneko
┃ • lewdk
┃ • spank
┃ • pussy
┃ • lesbian
┃ • thighs
┃ • blowjob2
╰━━━━━━━━━━━━━━━
╭━━【 𝐏𝐎𝐑𝐍 𝐌𝐄𝐍𝐔 】━━
┃ • porngif
┃ • pornpic
┃ • randomporn
┃ • pornsearch
╰━━━━━━━━━━━━━━━
╭━━【 𝐅𝐔𝐍 𝐌𝐄𝐍𝐔 】━━
┃ • joke
┃ • meme
┃ • cat
┃ • dog
┃ • coinflip
┃ • advice
┃ • say
┃ • roast
╰━━━━━━━━━━━━━━━
╭━━【𝐃𝐄𝐕 𝐌𝐄𝐍𝐔】━━
┃ • statics
┃ • listusers
┃ • stderror
┃ • osinfo
┃ • nodever
┃ • sysinfo
┃ • uptime
┃ • env
┃ • memory
╰━━━━━━━━━━━━━━━
╭━━【𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔】━━
┃ • qr
┃ • tts
┃ • translate
┃ • shorturl
┃ • paste
┃ • whois
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

// Plugin handler - ALL commands, real endpoints only, original structure only
async function handleCommand(ctx, { cmd, args }) {
  // Hentai/NSFW/Porn real public APIs
  const nekosBase = "https://nekos.life/api/v2/img";
  const waifuPicsBase = "https://api.waifu.pics/sfw";
  const waifuPicsNSFW = "https://api.waifu.pics/nsfw";
  const pornApi = {
    porngif: "https://nekos.life/api/v2/img/Random_hentai_gif",
    pornpic: "https://nekos.life/api/v2/img/hentai",
    randomporn: "https://api.waifu.pics/nsfw/waifu",
    pornsearch: "https://api.waifu.pics/nsfw/waifu"
  };
  const publicApi = {
    hentai: `${nekosBase}/hentai`,
    waifu: `${waifuPicsBase}/waifu`,
    blowjob: `${nekosBase}/blowjob`,
    boobs: `${nekosBase}/boobs`,
    neko: `${nekosBase}/neko`,
    trap: `${nekosBase}/trap`,
    lewd: `${nekosBase}/lewd`,
    anal: `${nekosBase}/anal`,
    cum: `${nekosBase}/cum`,
    femdom: `${nekosBase}/femdom`,
    feet: `${nekosBase}/feet`,
    solo: `${nekosBase}/solo`,
    yuri: `${nekosBase}/yuri`,
    nsfwneko: `${waifuPicsNSFW}/neko`,
    lewdk: `${waifuPicsNSFW}/lewd`,
    spank: `${nekosBase}/spank`,
    pussy: `${waifuPicsNSFW}/pussy`,
    lesbian: `${waifuPicsNSFW}/lesbian`,
    thighs: `${waifuPicsNSFW}/thighs`,
    blowjob2: `${waifuPicsNSFW}/blowjob`
  };
  try {
    switch (cmd) {
      // AI & DL & Other Menu (original)
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
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/ai/gpt?apikey=prince&q=${encodeURIComponent(args.join(' '))}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `🤖 ChatGPT:\n${ans}`);
        }
      case 'gemini':
        if (!args.length) return await sendBanner(ctx, 'Usage: .gemini <prompt>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/ai/geminiaipro?apikey=prince&q=${encodeURIComponent(args.join(' '))}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `🌈 Gemini:\n${ans}`);
        }
      case 'deepseek':
        if (!args.length) return await sendBanner(ctx, 'Usage: .deepseek <prompt>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/ai/deepseek-v3?apikey=prince&q=${encodeURIComponent(args.join(' '))}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `💡 Deepseek:\n${ans}`);
        }
      case 'apk':
        if (!args.length) return await sendBanner(ctx, 'Usage: .apk <app name>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=${encodeURIComponent(args.join(' '))}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `📦 APK:\n${ans}`);
        }
      case 'spotify':
        if (!args.length) return await sendBanner(ctx, 'Usage: .spotify <url>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/download/spotifydlv2?apikey=prince&url=${encodeURIComponent(args[0])}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `🎵 Spotify:\n${ans}`);
        }
      case 'gitclone':
        if (!args.length) return await sendBanner(ctx, 'Usage: .gitclone <github url>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/download/gitclone?apikey=prince&url=${encodeURIComponent(args[0])}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `🗃 GitClone:\n${ans}`);
        }
      case 'play':
        if (!args.length) return await sendBanner(ctx, 'Usage: .play <youtube url>');
        {
          let yturl = args[0];
          let { data } = await axios.get(`https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=${encodeURIComponent(yturl)}`);
          if (data.result && data.result.audio) {
            await ctx.replyWithAudio({ url: data.result.audio }, { title: data.result.title, ...channelButtons });
            return true;
          }
          let ans = getApiText(data);
          return await sendBanner(ctx, `🎶 Play:\n${ans}`);
        }
      case 'gdrive':
        if (!args.length) return await sendBanner(ctx, 'Usage: .gdrive <gdrive url>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/download/gdrivedl?apikey=prince&url=${encodeURIComponent(args[0])}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `🗂 Google Drive:\n${ans}`);
        }
      case 'xvideosearch':
        if (!args.length) return await sendBanner(ctx, 'Usage: .xvideosearch <query>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/search/xvideossearch?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `🔞 Xvideos Search:\n${ans}`);
        }
      case 'xnxxsearch':
        if (!args.length) return await sendBanner(ctx, 'Usage: .xnxxsearch <query>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/search/xnxxsearch?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `🔞 XNXX Search:\n${ans}`);
        }
      case 'dl-xnxxvid':
        if (!args.length) return await sendBanner(ctx, 'Usage: .dl-xnxxvid <xnxx url>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/download/xnxxdl?apikey=prince&url=${encodeURIComponent(args[0])}`);
          if (data.result && data.result.url) {
            await ctx.replyWithVideo({ url: data.result.url }, { ...channelButtons });
            return true;
          }
          let ans = getApiText(data);
          return await sendBanner(ctx, `🔞 DL-XNXX:\n${ans}`);
        }
      case 'dl-xvideo':
        if (!args.length) return await sendBanner(ctx, 'Usage: .dl-xvideo <xvideos url>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/download/xvideosdl?apikey=prince&url=${encodeURIComponent(args[0])}`);
          if (data.result && data.result.url) {
            await ctx.replyWithVideo({ url: data.result.url }, { ...channelButtons });
            return true;
          }
          let ans = getApiText(data);
          return await sendBanner(ctx, `🔞 DL-XVideo:\n${ans}`);
        }
      // Hentai menu
      case 'hentai':
      case 'waifu':
      case 'blowjob':
      case 'boobs':
      case 'neko':
      case 'trap':
      case 'lewd':
      case 'anal':
      case 'cum':
      case 'femdom':
      case 'feet':
      case 'solo':
      case 'yuri':
      case 'nsfwneko':
      case 'lewdk':
      case 'spank':
      case 'pussy':
      case 'lesbian':
      case 'thighs':
      case 'blowjob2': {
        let apiUrl = publicApi[cmd];
        let { data } = await axios.get(apiUrl, { timeout: 10_000 });
        let img = data.url || data.message;
        if (img) {
          await ctx.replyWithPhoto({ url: img }, { caption: `🔞 ${cmd.toUpperCase()}`, ...channelButtons });
          return true;
        }
        return await sendBanner(ctx, `No image found for ${cmd}.`);
      }
      // Porn menu
      case 'porngif':
      case 'pornpic':
      case 'randomporn': {
        let apiUrl = pornApi[cmd];
        let { data } = await axios.get(apiUrl, { timeout: 10_000 });
        let img = data.url || data.message;
        if (img) {
          await ctx.replyWithPhoto({ url: img }, { caption: `🔞 ${cmd.toUpperCase()}`, ...channelButtons });
          return true;
        }
        return await sendBanner(ctx, `No image found for ${cmd}.`);
      }
      case 'pornsearch': {
        let query = args.join(' ') || "waifu";
        let { data } = await axios.get(`${waifuPicsNSFW}/waifu`, { timeout: 10_000 });
        let img = data.url;
        if (img) {
          await ctx.replyWithPhoto({ url: img }, { caption: `🔞 Search result for "${query}"`, ...channelButtons });
          return true;
        }
        return await sendBanner(ctx, `No image found for ${query}.`);
      }
      // Fun menu
      case 'joke': {
        let { data } = await axios.get('https://v2.jokeapi.dev/joke/Any');
        let joke = data.type === "single" ? data.joke : `${data.setup}\n${data.delivery}`;
        return await sendBanner(ctx, `😂 Joke:\n${joke}`);
      }
      case 'meme': {
        let { data } = await axios.get('https://meme-api.com/gimme');
        return await ctx.replyWithPhoto({ url: data.url }, { caption: `🤣 Meme by ${data.author}`, ...channelButtons });
      }
      case 'cat': {
        let { data } = await axios.get('https://api.thecatapi.com/v1/images/search');
        let img = data[0].url;
        return await ctx.replyWithPhoto({ url: img }, { caption: `🐱 Cat`, ...channelButtons });
      }
      case 'dog': {
        let { data } = await axios.get('https://dog.ceo/api/breeds/image/random');
        let img = data.message;
        return await ctx.replyWithPhoto({ url: img }, { caption: `🐶 Dog`, ...channelButtons });
      }
      case 'coinflip': {
        const result = Math.random() > 0.5 ? "Heads" : "Tails";
        return await sendBanner(ctx, `🪙 Coinflip: ${result}`);
      }
      case 'advice': {
        let { data } = await axios.get('https://api.adviceslip.com/advice');
        return await sendBanner(ctx, `💡 Advice:\n${data.slip.advice}`);
      }
      case 'say':
        if (!args.length) return await sendBanner(ctx, 'Usage: .say <text>');
        return await sendBanner(ctx, args.join(' '));
      case 'roast': {
        let { data } = await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json');
        return await sendBanner(ctx, `🔥 Roast:\n${data.insult}`);
      }
      // Dev menu
      case 'stderror':
        return await sendBanner(ctx, `STDERR: ${(typeof process.stderr !== "undefined" ? "Available" : "Not available")}`);
      case 'osinfo':
        return await sendBanner(ctx, `OS Info:\n${os.type()} ${os.release()}\nArch: ${os.arch()}\nHostname: ${os.hostname()}`);
      case 'nodever':
        return await sendBanner(ctx, `Node Version: ${process.version}`);
      case 'sysinfo':
        return await sendBanner(ctx, `System Info:\nPlatform: ${os.platform()}\nCPUs: ${os.cpus().length}\nUptime: ${(os.uptime()/60|0)}m`);
      case 'uptime':
        return await sendBanner(ctx, `Uptime: ${(process.uptime()/60|0)}m ${Math.floor(process.uptime()%60)}s`);
      case 'env':
        return await sendBanner(ctx, 'ENV:\n' + Object.entries(process.env).map(([k,v]) => `${k}=${v}`).join('\n'));
      case 'memory':
        return await sendBanner(ctx, `Memory Usage:\n${JSON.stringify(process.memoryUsage(), null, 2)}`);
      // Tools menu
      case 'qr': {
        if (!args.length) return await sendBanner(ctx, 'Usage: .qr <text>');
        let url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(args.join(' '))}`;
        return await ctx.replyWithPhoto({ url }, { caption: '🔧 QR Code', ...channelButtons });
      }
      case 'tts': {
        if (!args.length) return await sendBanner(ctx, 'Usage: .tts <text>');
        let api = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(args.join(' '))}`;
        return await ctx.replyWithAudio({ url: api }, { title: '🔧 TTS', ...channelButtons });
      }
      case 'translate': {
        if (args.length < 2) return await sendBanner(ctx, 'Usage: .translate <lang> <text>');
        let [lang, ...txt] = args;
        let { data } = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(txt.join(' '))}&langpair=en|${lang}`);
        let txtOut = data.responseData.translatedText || "No translation.";
        return await sendBanner(ctx, `🔧 Translation:\n${txtOut}`);
      }
      case 'shorturl': {
        if (!args.length) return await sendBanner(ctx, 'Usage: .shorturl <url>');
        let { data } = await axios.get(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(args[0])}`);
        return await sendBanner(ctx, `🔧 Short URL:\n${data.result.full_short_link}`);
      }
      case 'paste': {
        if (!args.length) return await sendBanner(ctx, 'Usage: .paste <text>');
        let { data } = await axios.post('https://paste.c-net.org/', args.join(' '), { headers: { 'Content-Type': 'text/plain' } });
        return await sendBanner(ctx, `🔧 Paste: https://paste.c-net.org/${data}`);
      }
      case 'whois': {
        if (!args.length) return await sendBanner(ctx, 'Usage: .whois <domain>');
        let { data } = await axios.get(`https://api.api-ninjas.com/v1/whois?domain=${encodeURIComponent(args[0])}`, { headers: { 'X-Api-Key': 'PASTE_YOUR_API_KEY' } });
        return await sendBanner(ctx, `🔧 Whois:\n${getApiText(data)}`);
      }
      // Lyrics, wallpaper, weather, text2img, yts (original, keep as is)
      case 'lyrics':
        if (!args.length) return await sendBanner(ctx, 'Usage: .lyrics <song>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/search/lyrics?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `🎵 Lyrics:\n${ans}`);
        }
      case 'wallpaper':
        if (!args.length) return await sendBanner(ctx, 'Usage: .wallpaper <query>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/search/wallpaper?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
          let img = (data.result && data.result[0] && data.result[0].url) || "";
          if (img) {
            await ctx.replyWithPhoto({ url: img }, { caption: '🖼 Wallpaper', ...channelButtons });
            return true;
          }
          let ans = getApiText(data);
          return await sendBanner(ctx, `🖼 Wallpaper:\n${ans}`);
        }
      case 'weather':
        if (!args.length) return await sendBanner(ctx, 'Usage: .weather <location>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/search/weather?apikey=prince&location=${encodeURIComponent(args.join(' '))}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `🌦️ Weather:\n${ans}`);
        }
      case 'text2img':
        if (!args.length) return await sendBanner(ctx, 'Usage: .text2img <prompt>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/ai/text2img?apikey=prince&prompt=${encodeURIComponent(args.join(' '))}`);
          let img = (data.result && data.result.url) || "";
          if (img) {
            await ctx.replyWithPhoto({ url: img }, { caption: '🎨 AI Image', ...channelButtons });
            return true;
          }
          let ans = getApiText(data);
          return await sendBanner(ctx, `🎨 AI Image:\n${ans}`);
        }
      case 'yts':
        if (!args.length) return await sendBanner(ctx, 'Usage: .yts <query>');
        {
          let { data } = await axios.get(`https://api.princetechn.com/api/search/yts?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
          let ans = getApiText(data);
          return await sendBanner(ctx, `🎬 YTS Results:\n${ans}`);
        }
      default: return false;
    }
  } catch (e) {
    return await sendBanner(ctx, `❌ API error for ${cmd}.\n${(e.response?.data ? getApiText(e.response.data) : e.message)}`);
  }
}

// Main message handler: only respond if menu trigger or valid prefix+command!
bot.on('text', async (ctx, next) => {
  try {
    registerUser(ctx);
    const command = parseCommand(ctx.message.text);
    if (command) {
      let handled = await handleCommand(ctx, command);
      return;
    }
  } catch (_) {}
  await next();
});

// Keepalive HTTP Server for Render/Termux
require('http').createServer((_, res) => res.end('Bot is running')).listen(process.env.PORT || 3000);

// Start
bot.launch()
  .then(() => console.log('CYBIX BOT started.'))
  .catch(err => { console.error('Failed to start bot:', err); process.exit(1); });
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));