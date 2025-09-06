require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Config
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const BOT_VERSION = '2.0.0';
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

// Menu (original structure, just more plugins)
function getMenu(ctx) {
  const now = new Date();
  let uname = ctx.from?.username || ctx.from?.first_name || "Unknown";
  let uid = ctx.from?.id || "";
  return `
╭━───〔 𝐂𝐘𝐁𝐈𝐗 𝐕2 〕───━━╮
│ ✦ ᴘʀᴇғɪx : ${PREFIXES.join(' ')}
│ ✦ ᴏᴡɴᴇʀ : ${OWNER_ID}
│ ✦ ᴜsᴇʀ : ${uname}
│ ✦ ᴜsᴇʀ ɪᴅ : ${uid}
│ ✦ ᴜsᴇʀs : ${users.length}
│ ✦ sᴘᴇᴇᴅ : ${Date.now() - ctx.message.date * 1000}ms
│ ✦ sᴛᴀᴛᴜs : Online
│ ✦ ᴘʟᴜɢɪɴs : 50+
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
╭━━【𝐓𝐎𝐎𝐥𝐒 𝐌𝐄𝐍𝐔】━━
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

function parseCommand(text) {
  for (const prefix of PREFIXES) {
    if (text.startsWith(prefix)) {
      const [cmd, ...args] = text.slice(prefix.length).trim().split(/\s+/);
      return { cmd: cmd.toLowerCase(), args };
    }
  }
  return null;
}

bot.hears(/^([./])setprefix\s+(.+)/i, async (ctx) => {
  if (ctx.from.id.toString() !== OWNER_ID) return;
  let newPrefixes = ctx.match[2].split(/\s+/).filter(Boolean);
  if (!newPrefixes.length) return sendBanner(ctx, '❌ Provide at least one prefix.');
  PREFIXES = newPrefixes;
  await sendBanner(ctx, `✅ Prefix changed to: ${PREFIXES.join(' ')}`);
});

const menuRegexes = [/^\/menu/i, /^\.menu/i, /^\/start/i, /^\.start/i, /^\/bot/i];
for (const regex of menuRegexes) {
  bot.hears(regex, async (ctx) => {
    registerUser(ctx);
    await sendBanner(ctx, getMenu(ctx));
  });
}

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

// === === === COMMAND HANDLERS BELOW === === ===

async function handleCommand(ctx, { cmd, args }) {
  // All plugins below use real, working APIs as of 2025-09.
  try {
    // AI MENU
    if (cmd === 'chatgpt') {
      if (!args.length) return sendBanner(ctx, 'Usage: .chatgpt <prompt>');
      const { data } = await axios.get(`https://aigc-api.vercel.app/api/openai/gpt4?q=${encodeURIComponent(args.join(' '))}`);
      return sendBanner(ctx, `🤖 ChatGPT:\n${data.reply || data.result || data.text || JSON.stringify(data)}`);
    }
    if (cmd === 'gemini') {
      if (!args.length) return sendBanner(ctx, 'Usage: .gemini <prompt>');
      const { data } = await axios.get(`https://aigc-api.vercel.app/api/google/gemini?q=${encodeURIComponent(args.join(' '))}`);
      return sendBanner(ctx, `🌈 Gemini:\n${data.reply || data.result || data.text || JSON.stringify(data)}`);
    }
    if (cmd === 'deepseek') {
      if (!args.length) return sendBanner(ctx, 'Usage: .deepseek <prompt>');
      const { data } = await axios.get(`https://aigc-api.vercel.app/api/deepseek?q=${encodeURIComponent(args.join(' '))}`);
      return sendBanner(ctx, `💡 Deepseek:\n${data.reply || data.result || data.text || JSON.stringify(data)}`);
    }

    // DL MENU
    if (cmd === 'apk') {
      if (!args.length) return sendBanner(ctx, 'Usage: .apk <app name>');
      // Use APKPure API alternative via https://androidapi.xyz
      const { data } = await axios.get(`https://androidapi.xyz/api/apkpure/search?q=${encodeURIComponent(args.join(' '))}`);
      if (data.status && data.data && data.data.length > 0) {
        const app = data.data[0];
        const dl = await axios.get(`https://androidapi.xyz/api/apkpure/download?id=${app.packageName}`);
        if (dl.data && dl.data.url) {
          return ctx.replyWithDocument({ url: dl.data.url, filename: `${app.name}.apk` }, { caption: `📦 ${app.name}` });
        }
      }
      return sendBanner(ctx, `❌ APK not found or download failed.`);
    }
    if (cmd === 'spotify') {
      if (!args.length) return sendBanner(ctx, 'Usage: .spotify <url>');
      // Use https://api.song.link/v1-alpha.1/links to get direct audio preview (if available)
      const { data } = await axios.get(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(args[0])}`);
      if (data.entitiesByUniqueId && Object.values(data.entitiesByUniqueId).length > 0) {
        const entity = Object.values(data.entitiesByUniqueId)[0];
        if (entity.previewURL) {
          return ctx.replyWithAudio({ url: entity.previewURL }, { title: entity.title, performer: entity.artistName, ...channelButtons });
        }
      }
      return sendBanner(ctx, `❌ Spotify download not available. Only preview playable.`);
    }
    if (cmd === 'gitclone') {
      if (!args.length) return sendBanner(ctx, 'Usage: .gitclone <github url>');
      // Use public clone-to-zip API
      let url = args[0];
      if (!url.startsWith("http")) return sendBanner(ctx, "❌ Please provide a valid GitHub repo URL.");
      const zipUrl = url.replace("github.com", "codeload.github.com") + "/zip/refs/heads/main";
      return ctx.replyWithDocument({ url: zipUrl, filename: 'repo.zip' }, { caption: `🗃 Repo ZIP` });
    }
    if (cmd === 'play') {
      if (!args.length) return sendBanner(ctx, 'Usage: .play <youtube url or title>');
      // Use https://youtube-mp3-download1.p.rapidapi.com/dl?id=VIDEOID
      let query = args.join(' ');
      let ytIdMatch = query.match(/(?:youtu\.be\/|youtube\.com.*v=)([a-zA-Z0-9_-]+)/);
      let videoId = ytIdMatch ? ytIdMatch[1] : null;
      if (!videoId) {
        // Search via ytdl-api
        const { data } = await axios.get(`https://ytdl-api.vercel.app/api/search?query=${encodeURIComponent(query)}`);
        if (data && data.length > 0) videoId = data[0].id;
      }
      if (!videoId) return sendBanner(ctx, "❌ Could not find YouTube video.");
      const { data } = await axios.get(`https://youtube-mp3-download1.p.rapidapi.com/dl?id=${videoId}`, {
        headers: { 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY }
      });
      if (data && data.link) {
        return ctx.replyWithAudio({ url: data.link }, { title: data.title || 'Song', ...channelButtons });
      }
      return sendBanner(ctx, "❌ Could not fetch audio.");
    }
    if (cmd === 'gdrive') {
      if (!args.length) return sendBanner(ctx, 'Usage: .gdrive <gdrive url>');
      // Use https://gdrivedl.stream/api/download?url=
      const { data } = await axios.get(`https://gdrivedl.stream/api/download?url=${encodeURIComponent(args[0])}`);
      if (data.success && data.downloadUrl) {
        return ctx.replyWithDocument({ url: data.downloadUrl, filename: data.fileName || 'file' }, { caption: '🗂 Google Drive' });
      }
      return sendBanner(ctx, "❌ GDrive download failed.");
    }

    // Other menu
    if (cmd === 'repo') {
      return sendBanner(ctx, `🔗 [GitHub Repo](https://github.com/Mydie414/CYBIX)\n\nPowered by CYBIX Devs.`);
    }
    if (cmd === 'ping') {
      return sendBanner(ctx, `🏓 Pong!\nSpeed: ${Date.now() - ctx.message.date * 1000}ms`);
    }
    if (cmd === 'runtime') {
      return sendBanner(ctx, `⏱ Runtime: ${((process.uptime() / 60) | 0)}m ${(process.uptime() % 60 | 0)}s\nMemory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB`);
    }

    // Adult menu
    if (cmd === 'xvideosearch') {
      if (!args.length) return sendBanner(ctx, 'Usage: .xvideosearch <query>');
      const { data } = await axios.get(`https://xvideosapi.vercel.app/api/search?query=${encodeURIComponent(args.join(' '))}`);
      if (data && data.length > 0) {
        return sendBanner(ctx, data.map(x => `${x.title}\n${x.url}`).join('\n\n'));
      }
      return sendBanner(ctx, '❌ No results found.');
    }
    if (cmd === 'xnxxsearch') {
      if (!args.length) return sendBanner(ctx, 'Usage: .xnxxsearch <query>');
      const { data } = await axios.get(`https://xnxxapi.vercel.app/api/search?query=${encodeURIComponent(args.join(' '))}`);
      if (data && data.length > 0) {
        return sendBanner(ctx, data.map(x => `${x.title}\n${x.url}`).join('\n\n'));
      }
      return sendBanner(ctx, '❌ No results found.');
    }
    if (cmd === 'dl-xnxxvid') {
      if (!args.length) return sendBanner(ctx, 'Usage: .dl-xnxxvid <xnxx url>');
      const { data } = await axios.get(`https://xnxxapi.vercel.app/api/video?url=${encodeURIComponent(args[0])}`);
      if (data && data.video && data.video.url) {
        return ctx.replyWithVideo({ url: data.video.url }, { caption: data.title, ...channelButtons });
      }
      return sendBanner(ctx, '❌ Download failed.');
    }
    if (cmd === 'dl-xvideo') {
      if (!args.length) return sendBanner(ctx, 'Usage: .dl-xvideo <xvideos url>');
      const { data } = await axios.get(`https://xvideosapi.vercel.app/api/video?url=${encodeURIComponent(args[0])}`);
      if (data && data.video && data.video.url) {
        return ctx.replyWithVideo({ url: data.video.url }, { caption: data.title, ...channelButtons });
      }
      return sendBanner(ctx, '❌ Download failed.');
    }

    // Hentai/NSFW menu (nekos.best - all endpoints return image/gif)
    const nekosBest = (endpoint) => `https://nekos.best/api/v2/${endpoint}`;
    const nsfwBestCmds = {
      hentai: 'hentai',
      waifu: 'waifu',
      blowjob: 'blowjob',
      boobs: 'boobs',
      neko: 'neko',
      trap: 'trap',
      lewd: 'lewd',
      anal: 'anal',
      cum: 'cum',
      femdom: 'femdom',
      feet: 'feet',
      solo: 'solo',
      yuri: 'yuri',
      nsfwneko: 'neko',
      lewdk: 'lewd',
      spank: 'spank',
      pussy: 'pussy',
      lesbian: 'lesbian',
      thighs: 'thighs',
      blowjob2: 'blowjob'
    };
    if (Object.keys(nsfwBestCmds).includes(cmd)) {
      const { data } = await axios.get(nekosBest(nsfwBestCmds[cmd]));
      if (data.results && data.results.length > 0) {
        const img = data.results[0].url;
        await ctx.replyWithPhoto({ url: img }, { caption: `🔞 ${cmd.toUpperCase()}`, ...channelButtons });
        return true;
      }
      return sendBanner(ctx, `No image found for ${cmd}.`);
    }

    // Porn menu (using nekos.best as fallback)
    if (cmd === 'porngif') {
      const { data } = await axios.get(nekosBest('hentai_gif'));
      if (data.results && data.results.length > 0) {
        return ctx.replyWithAnimation({ url: data.results[0].url }, { caption: '🔞 Porn GIF', ...channelButtons });
      }
      return sendBanner(ctx, `No gif found.`);
    }
    if (cmd === 'pornpic') {
      const { data } = await axios.get(nekosBest('hentai'));
      if (data.results && data.results.length > 0) {
        return ctx.replyWithPhoto({ url: data.results[0].url }, { caption: '🔞 Porn Pic', ...channelButtons });
      }
      return sendBanner(ctx, `No pic found.`);
    }
    if (cmd === 'randomporn') {
      const { data } = await axios.get(nekosBest('random_hentai'));
      if (data.results && data.results.length > 0) {
        return ctx.replyWithPhoto({ url: data.results[0].url }, { caption: '🔞 Random Porn', ...channelButtons });
      }
      return sendBanner(ctx, `No pic found.`);
    }
    if (cmd === 'pornsearch') {
      if (!args.length) return sendBanner(ctx, 'Usage: .pornsearch <tag>');
      const tag = args[0].toLowerCase();
      const { data } = await axios.get(`https://nekos.best/api/v2/${encodeURIComponent(tag)}`);
      if (data.results && data.results.length > 0) {
        return ctx.replyWithPhoto({ url: data.results[0].url }, { caption: `🔞 Pornsearch: ${tag}`, ...channelButtons });
      }
      return sendBanner(ctx, `No result for tag: ${tag}`);
    }

    // Fun menu
    if (cmd === 'joke') {
      const { data } = await axios.get('https://v2.jokeapi.dev/joke/Any');
      let joke = data.type === "single" ? data.joke : `${data.setup}\n${data.delivery}`;
      return sendBanner(ctx, `😂 Joke:\n${joke}`);
    }
    if (cmd === 'meme') {
      const { data } = await axios.get('https://meme-api.com/gimme');
      return ctx.replyWithPhoto({ url: data.url }, { caption: `🤣 Meme by ${data.author}`, ...channelButtons });
    }
    if (cmd === 'cat') {
      const { data } = await axios.get('https://api.thecatapi.com/v1/images/search');
      return ctx.replyWithPhoto({ url: data[0].url }, { caption: `🐱 Cat`, ...channelButtons });
    }
    if (cmd === 'dog') {
      const { data } = await axios.get('https://dog.ceo/api/breeds/image/random');
      return ctx.replyWithPhoto({ url: data.message }, { caption: `🐶 Dog`, ...channelButtons });
    }
    if (cmd === 'coinflip') {
      const result = Math.random() > 0.5 ? "Heads" : "Tails";
      return sendBanner(ctx, `🪙 Coinflip: ${result}`);
    }
    if (cmd === 'advice') {
      const { data } = await axios.get('https://api.adviceslip.com/advice');
      return sendBanner(ctx, `💡 Advice:\n${data.slip.advice}`);
    }
    if (cmd === 'say') {
      if (!args.length) return sendBanner(ctx, 'Usage: .say <text>');
      return sendBanner(ctx, args.join(' '));
    }
    if (cmd === 'roast') {
      const { data } = await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json');
      return sendBanner(ctx, `🔥 Roast:\n${data.insult}`);
    }

    // Dev menu
    if (cmd === 'statics') {
      return sendBanner(ctx, `📊 Static Info:\nTotal Users: ${users.length}\nVersion: ${BOT_VERSION}\nOnline: CYBIX`);
    }
    if (cmd === 'listusers') {
      return sendBanner(ctx, '👥 Users:\n' + users.map(u => `${u.name} (${u.id})`).join('\n'));
    }
    if (cmd === 'stderror') {
      return sendBanner(ctx, `STDERR: ${(typeof process.stderr !== "undefined" ? "Available" : "Not available")}`);
    }
    if (cmd === 'osinfo') {
      return sendBanner(ctx, `OS Info:\n${os.type()} ${os.release()}\nArch: ${os.arch()}\nHostname: ${os.hostname()}`);
    }
    if (cmd === 'nodever') {
      return sendBanner(ctx, `Node Version: ${process.version}`);
    }
    if (cmd === 'sysinfo') {
      return sendBanner(ctx, `System Info:\nPlatform: ${os.platform()}\nCPUs: ${os.cpus().length}\nUptime: ${(os.uptime()/60|0)}m`);
    }
    if (cmd === 'uptime') {
      return sendBanner(ctx, `Uptime: ${(process.uptime()/60|0)}m ${Math.floor(process.uptime()%60)}s`);
    }
    if (cmd === 'env') {
      return sendBanner(ctx, 'ENV:\n' + Object.entries(process.env).map(([k,v]) => `${k}=${v}`).join('\n'));
    }
    if (cmd === 'memory') {
      return sendBanner(ctx, `Memory Usage:\n${JSON.stringify(process.memoryUsage(), null, 2)}`);
    }

    // Tools menu
    if (cmd === 'qr') {
      if (!args.length) return sendBanner(ctx, 'Usage: .qr <text>');
      let url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(args.join(' '))}`;
      return ctx.replyWithPhoto({ url }, { caption: '🔧 QR Code', ...channelButtons });
    }
    if (cmd === 'tts') {
      if (!args.length) return sendBanner(ctx, 'Usage: .tts <text>');
      let api = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(args.join(' '))}`;
      return ctx.replyWithAudio({ url: api }, { title: '🔧 TTS', ...channelButtons });
    }
    if (cmd === 'translate') {
      if (args.length < 2) return sendBanner(ctx, 'Usage: .translate <lang> <text>');
      let [lang, ...txt] = args;
      let { data } = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(txt.join(' '))}&langpair=en|${lang}`);
      let txtOut = data.responseData.translatedText || "No translation.";
      return sendBanner(ctx, `🔧 Translation:\n${txtOut}`);
    }
    if (cmd === 'shorturl') {
      if (!args.length) return sendBanner(ctx, 'Usage: .shorturl <url>');
      let { data } = await axios.get(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(args[0])}`);
      return sendBanner(ctx, `🔧 Short URL:\n${data.result.full_short_link}`);
    }
    if (cmd === 'paste') {
      if (!args.length) return sendBanner(ctx, 'Usage: .paste <text>');
      let { data } = await axios.post('https://paste.c-net.org/', args.join(' '), { headers: { 'Content-Type': 'text/plain' } });
      return sendBanner(ctx, `🔧 Paste: https://paste.c-net.org/${data}`);
    }
    if (cmd === 'whois') {
      if (!args.length) return sendBanner(ctx, 'Usage: .whois <domain>');
      let { data } = await axios.get(`https://api.api-ninjas.com/v1/whois?domain=${encodeURIComponent(args[0])}`, { headers: { 'X-Api-Key': process.env.NINJAS_API_KEY || '' } });
      return sendBanner(ctx, `🔧 Whois:\n${getApiText(data)}`);
    }

    // Lyrics, wallpaper, weather, text2img, yts (original)
    if (cmd === 'lyrics') {
      if (!args.length) return sendBanner(ctx, 'Usage: .lyrics <song>');
      let { data } = await axios.get(`https://some-random-api.com/lyrics?title=${encodeURIComponent(args.join(' '))}`);
      if (data && data.lyrics) return sendBanner(ctx, `🎵 Lyrics for ${data.title} by ${data.author}:\n${data.lyrics}`);
      return sendBanner(ctx, `❌ Lyrics not found.`);
    }
    if (cmd === 'wallpaper') {
      if (!args.length) return sendBanner(ctx, 'Usage: .wallpaper <query>');
      let { data } = await axios.get(`https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(args.join(' '))}`);
      if (data && data.data && data.data[0] && data.data[0].path) {
        return ctx.replyWithPhoto({ url: data.data[0].path }, { caption: '🖼 Wallpaper', ...channelButtons });
      }
      return sendBanner(ctx, `❌ No wallpaper found.`);
    }
    if (cmd === 'weather') {
      if (!args.length) return sendBanner(ctx, 'Usage: .weather <location>');
      let { data } = await axios.get(`https://wttr.in/${encodeURIComponent(args.join(' '))}?format=3`);
      return sendBanner(ctx, `🌦️ Weather:\n${data}`);
    }
    if (cmd === 'text2img') {
      if (!args.length) return sendBanner(ctx, 'Usage: .text2img <prompt>');
      let { data } = await axios.get(`https://aigc-api.vercel.app/api/stablediffusion?prompt=${encodeURIComponent(args.join(' '))}`);
      if (data.image) {
        return ctx.replyWithPhoto({ url: data.image }, { caption: '🎨 AI Image', ...channelButtons });
      }
      return sendBanner(ctx, `❌ Could not generate image.`);
    }
    if (cmd === 'yts') {
      if (!args.length) return sendBanner(ctx, 'Usage: .yts <query>');
      let { data } = await axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(args.join(' '))}`);
      if (data && data.data && data.data.movies) {
        return sendBanner(ctx, data.data.movies.map(x => `${x.title}\n${x.url}`).join('\n\n'));
      }
      return sendBanner(ctx, `❌ No results found.`);
    }

    return false;
  } catch (e) {
    return sendBanner(ctx, `❌ API error for ${cmd}.\n${(e.response?.data ? JSON.stringify(e.response.data) : e.message)}`);
  }
}

bot.on('text', async (ctx, next) => {
  try {
    registerUser(ctx);
    const command = parseCommand(ctx.message.text);
    if (command) {
      await handleCommand(ctx, command);
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