require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const os = require('os');
const path = require('path');
const tmp = require('tmp-promise');

/* === CONFIG & GLOBALS === */
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const BOT_VERSION = '4.0.0';
const BANNER_URL = 'https://files.catbox.moe/8l5mky.jpg';
const TG_CHANNEL = 'https://t.me/cybixtech';
const WA_CHANNEL = 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X';
let PREFIXES = ['.', '/'];
if (!BOT_TOKEN || !OWNER_ID) throw new Error('Set BOT_TOKEN and OWNER_ID in .env');
const bot = new Telegraf(BOT_TOKEN);

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

/* === BANNER & MENU === */
const channelButtons = Markup.inlineKeyboard([
  [Markup.button.url('📢 Telegram Channel', TG_CHANNEL)],
  [Markup.button.url('🟢 WhatsApp Channel', WA_CHANNEL)]
]);
async function sendBanner(ctx, text, extra = {}) {
  try {
    await ctx.replyWithPhoto({ url: BANNER_URL }, { caption: text, ...channelButtons, ...extra });
  } catch (_) {
    try { await ctx.reply(text, { ...channelButtons, ...extra }); } catch (_) {}
  }
}
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
│ ✦ ᴘʟᴜɢɪɴs : 60+
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
`.trim();
}

/* === COMMAND PARSING === */
function parseCommand(text) {
  for (const prefix of PREFIXES) {
    if (text.startsWith(prefix)) {
      const [cmd, ...args] = text.slice(prefix.length).trim().split(/\s+/);
      return { cmd: cmd.toLowerCase(), args };
    }
  }
  return null;
}

/* === PREFIX AND MENU === */
bot.hears(/^([./])setprefix\s+(.+)/i, async (ctx) => {
  if (ctx.from.id.toString() !== OWNER_ID) return;
  let newPrefixes = ctx.match[2].split(/\s+/).filter(Boolean);
  if (!newPrefixes.length) return sendBanner(ctx, '❌ Provide at least one prefix.');
  PREFIXES = newPrefixes;
  await sendBanner(ctx, `✅ Prefix changed to: ${PREFIXES.join(' ')}`);
});
const menuRegexes = [
  /^\/menu/i, /^\.menu/i, /^\/start/i, /^\.start/i, /^\/bot/i
];
for (const regex of menuRegexes) {
  bot.hears(regex, async (ctx) => {
    registerUser(ctx);
    await sendBanner(ctx, getMenu(ctx));
  });
}

/* === API OUTPUT PARSER === */
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
async function downloadFileFromUrl(url, ext = '') {
  const { path: tmpPath, cleanup } = await tmp.file({ postfix: ext ? '.' + ext : '' });
  const writer = fs.createWriteStream(tmpPath);
  const response = await axios.get(url, { responseType: 'stream' });
  await new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  return { tmpPath, cleanup };
}

/* === COMMAND HANDLER === */
async function handleCommand(ctx, { cmd, args }) {
  try {
    // ===== AI MENU =====
    if (cmd === 'chatgpt') {
      if (!args.length) return sendBanner(ctx, 'Usage: .chatgpt <prompt>');
      const { data } = await axios.get(`https://api.princetechn.com/api/ai/gpt?apikey=prince&q=${encodeURIComponent(args.join(' '))}`);
      return sendBanner(ctx, `🤖 ChatGPT:\n${getApiText(data)}`);
    }
    if (cmd === 'gemini') {
      if (!args.length) return sendBanner(ctx, 'Usage: .gemini <prompt>');
      const { data } = await axios.get(`https://api.princetechn.com/api/ai/geminiaipro?apikey=prince&q=${encodeURIComponent(args.join(' '))}`);
      return sendBanner(ctx, `🌈 Gemini:\n${getApiText(data)}`);
    }
    if (cmd === 'deepseek') {
      if (!args.length) return sendBanner(ctx, 'Usage: .deepseek <prompt>');
      const { data } = await axios.get(`https://api.princetechn.com/api/ai/deepseek-v3?apikey=prince&q=${encodeURIComponent(args.join(' '))}`);
      return sendBanner(ctx, `💡 Deepseek:\n${getApiText(data)}`);
    }

    // ===== DL MENU =====
    if (cmd === 'apk') {
      if (!args.length) return sendBanner(ctx, 'Usage: .apk <app name>');
      const { data } = await axios.get(`https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=${encodeURIComponent(args.join(' '))}`);
      if (data && data.result && data.result.url) {
        const { tmpPath, cleanup } = await downloadFileFromUrl(data.result.url, 'apk');
        await ctx.replyWithDocument({ source: tmpPath, filename: (data.result.title || args.join(' ')) + '.apk' }, { caption: `📦 APK: ${data.result.title || args.join(' ')}` });
        cleanup();
      } else return sendBanner(ctx, `❌ APK API error.`);
      return;
    }
    if (cmd === 'spotify') {
      if (!args.length) return sendBanner(ctx, 'Usage: .spotify <url>');
      const { data } = await axios.get(`https://api.princetechn.com/api/download/spotifydlv2?apikey=prince&url=${encodeURIComponent(args[0])}`);
      if (data && data.result && data.result.audio) {
        const { tmpPath, cleanup } = await downloadFileFromUrl(data.result.audio, 'mp3');
        await ctx.replyWithAudio({ source: tmpPath }, { title: data.result.title || "Spotify", ...channelButtons });
        cleanup();
      } else return sendBanner(ctx, `❌ Spotify API error.`);
      return;
    }
    if (cmd === 'gitclone') {
      if (!args.length) return sendBanner(ctx, 'Usage: .gitclone <github url>');
      const { data } = await axios.get(`https://api.princetechn.com/api/download/gitclone?apikey=prince&url=${encodeURIComponent(args[0])}`);
      if (data && data.result && data.result.url) {
        const { tmpPath, cleanup } = await downloadFileFromUrl(data.result.url, 'zip');
        await ctx.replyWithDocument({ source: tmpPath, filename: 'repo.zip' }, { caption: `🗃 Repo ZIP` });
        cleanup();
      } else return sendBanner(ctx, `❌ GitClone API error.`);
      return;
    }
    if (cmd === 'play') {
      if (!args.length) return sendBanner(ctx, 'Usage: .play <youtube url>');
      const { data } = await axios.get(`https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=${encodeURIComponent(args[0])}`);
      if (data && data.result && data.result.audio) {
        const { tmpPath, cleanup } = await downloadFileFromUrl(data.result.audio, 'mp3');
        await ctx.replyWithAudio({ source: tmpPath }, { title: data.result.title || "YouTube MP3", ...channelButtons });
        cleanup();
      } else return sendBanner(ctx, `❌ Play API error.`);
      return;
    }
    if (cmd === 'gdrive') {
      if (!args.length) return sendBanner(ctx, 'Usage: .gdrive <gdrive url>');
      const { data } = await axios.get(`https://api.princetechn.com/api/download/gdrivedl?apikey=prince&url=${encodeURIComponent(args[0])}`);
      if (data && data.result && data.result.url) {
        const ext = data.result.filename ? data.result.filename.split('.').pop() : '';
        const { tmpPath, cleanup } = await downloadFileFromUrl(data.result.url, ext);
        await ctx.replyWithDocument({ source: tmpPath, filename: data.result.filename || "gdrive.file" }, { caption: '🗂 Google Drive', ...channelButtons });
        cleanup();
      } else return sendBanner(ctx, `❌ GDrive API error.`);
      return;
    }

    // ===== OTHER MENU =====
    if (cmd === 'repo') {
      return sendBanner(ctx, `🔗 [GitHub Repo](https://github.com/Mydie414/CYBIX)\n\nPowered by CYBIX Devs.`);
    }
    if (cmd === 'ping') {
      return sendBanner(ctx, `🏓 Pong!\nSpeed: ${Date.now() - ctx.message.date * 1000}ms`);
    }
    if (cmd === 'runtime') {
      return sendBanner(ctx, `⏱ Runtime: ${((process.uptime() / 60) | 0)}m ${(process.uptime() % 60 | 0)}s\nMemory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB`);
    }

    // ===== ADULT MENU =====
    if (cmd === 'xvideosearch') {
      if (!args.length) return sendBanner(ctx, 'Usage: .xvideosearch <query>');
      const { data } = await axios.get(`https://api.princetechn.com/api/search/xvideossearch?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
      return sendBanner(ctx, getApiText(data));
    }
    if (cmd === 'xnxxsearch') {
      if (!args.length) return sendBanner(ctx, 'Usage: .xnxxsearch <query>');
      const { data } = await axios.get(`https://api.princetechn.com/api/search/xnxxsearch?apikey=prince&query=${encodeURIComponent(args.join(' '))}`);
      return sendBanner(ctx, getApiText(data));
    }
    if (cmd === 'dl-xnxxvid') {
      if (!args.length) return sendBanner(ctx, 'Usage: .dl-xnxxvid <xnxx url>');
      const { data } = await axios.get(`https://api.princetechn.com/api/download/xnxxdl?apikey=prince&url=${encodeURIComponent(args[0])}`);
      if (data && data.result && data.result.url) {
        const { tmpPath, cleanup } = await downloadFileFromUrl(data.result.url, 'mp4');
        await ctx.replyWithVideo({ source: tmpPath }, { caption: '🔞 XNXX Video', ...channelButtons });
        cleanup();
      } else return sendBanner(ctx, `❌ XNXXDL API error.`);
      return;
    }
    if (cmd === 'dl-xvideo') {
      if (!args.length) return sendBanner(ctx, 'Usage: .dl-xvideo <xvideos url>');
      const { data } = await axios.get(`https://api.princetechn.com/api/download/xvideosdl?apikey=prince&url=${encodeURIComponent(args[0])}`);
      if (data && data.result && data.result.url) {
        const { tmpPath, cleanup } = await downloadFileFromUrl(data.result.url, 'mp4');
        await ctx.replyWithVideo({ source: tmpPath }, { caption: '🔞 XVideos Video', ...channelButtons });
        cleanup();
      } else return sendBanner(ctx, `❌ XVideosDL API error.`);
      return;
    }

    // ===== HENTAI, NSFW, PORN MENUS =====
    const nekosBest = (endpoint) => `https://nekos.best/api/v2/${endpoint}`;
    const nsfwBestCmds = {
      hentai: 'hentai', waifu: 'waifu', blowjob: 'blowjob', boobs: 'boobs', neko: 'neko', trap: 'trap', lewd: 'lewd',
      anal: 'anal', cum: 'cum', femdom: 'femdom', feet: 'feet', solo: 'solo', yuri: 'yuri',
      nsfwneko: 'neko', lewdk: 'lewd', spank: 'spank', pussy: 'pussy', lesbian: 'lesbian', thighs: 'thighs', blowjob2: 'blowjob'
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

    // ===== FUN MENU =====
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

    // ===== DEV MENU =====
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

    // ===== TOOLS MENU =====
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

    return false;
  } catch (e) {
    let msg = e && e.response && e.response.data
      ? (typeof e.response.data === 'object' ? JSON.stringify(e.response.data, null, 2) : e.response.data)
      : (e.message || String(e));
    return sendBanner(ctx, `❌ API error for ${cmd}.\n${msg}`);
  }
}

/* === TEXT HANDLER === */
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

/* === KEEPALIVE === */
require('http').createServer((_, res) => res.end('Bot is running')).listen(process.env.PORT || 3000);

/* === BOT START === */
bot.launch()
  .then(() => console.log('CYBIX BOT started.'))
  .catch(err => { console.error('Failed to start bot:', err); process.exit(1); });
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));