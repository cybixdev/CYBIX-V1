import 'dotenv/config.js';
import { Telegraf, Markup } from 'telegraf';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIG ===
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const TG_CHANNEL = process.env.TG_CHANNEL || 't.me://cybixtech';
const TG_CHANNEL_USERNAME = process.env.TG_CHANNEL_USERNAME || 'cybixtech';
const WA_CHANNEL = process.env.WA_CHANNEL || 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X';
let BANNER_URL = process.env.BANNER_URL || 'https://files.catbox.moe/2x9p8j.jpg';
let BOT_NAME = process.env.BOT_NAME || 'CYBIX V1';
const BOT_VERSION = '1.2.0';
let PREFIXES = ['.', '/'];

if (!BOT_TOKEN || !OWNER_ID) throw new Error('Set BOT_TOKEN and OWNER_ID in .env');

const bot = new Telegraf(BOT_TOKEN);

// === USER DB ===
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

// === BANNER REPLY ===
function getChannelButtons() {
  return Markup.inlineKeyboard([
    [Markup.button.url('📢 Telegram Channel', TG_CHANNEL)],
    [Markup.button.url('🟢 WhatsApp Channel', WA_CHANNEL)]
  ]);
}
async function sendBanner(ctx, text, extra = {}) {
  try {
    await ctx.replyWithPhoto({ url: BANNER_URL }, {
      caption: text,
      ...getChannelButtons(),
      ...extra
    });
  } catch (_) {
    try { await ctx.reply(text, { ...getChannelButtons(), ...extra }); } catch (_) {}
  }
}

// === FORCE JOIN MIDDLEWARE ===
async function requireChannelJoin(ctx, next) {
  if (!ctx.from || !ctx.chat || ctx.chat.type !== 'private') return next();
  try {
    const member = await ctx.telegram.getChatMember('@' + TG_CHANNEL_USERNAME, ctx.from.id);
    if (['member', 'administrator', 'creator'].includes(member.status)) {
      return next();
    } else {
      await sendBanner(ctx, `🚫 Please join our Telegram channel to use this bot!\n\n[Join Channel](${TG_CHANNEL.replace('t.me://', 'https://t.me/')})\nAfter joining, press /start again.`);
      return;
    }
  } catch (e) {
    await sendBanner(ctx, `🚫 Please join our Telegram channel to use this bot!\n\n[Join Channel](${TG_CHANNEL.replace('t.me://', 'https://t.me/')})\nAfter joining, press /start again.`);
    return;
  }
}
bot.use(requireChannelJoin);

// === MENU ===
function getMenu(ctx) {
  const now = new Date();
  let uname = ctx.from?.username || ctx.from?.first_name || "Unknown";
  let uid = ctx.from?.id || "";
  let pluginsList = [
    "• chatgpt", "• gemini", "• deepseek", "• trivia", "• mathquiz", "• 8ball", "• apk", "• spotify", "• gitclone", "• play", "• gdrive",
    "• repo", "• ping", "• runtime", "• xvideosearch", "• xnxxsearch", "• dl-xnxxvid", "• dl-xvideo",
    "• statics", "• listusers", "• lyrics", "• wallpaper", "• weather", "• text2img", "• yts",
    "• setbanner", "• setprefix", "• setbotname", "• broadcast"
  ];
  return `
╭━───〔 ${BOT_NAME} 〕───━━╮
│ ✦ Prefix : ${PREFIXES.join(' ')}
│ ✦ Owner : ${OWNER_ID}
│ ✦ User : ${uname}
│ ✦ User ID : ${uid}
│ ✦ Users : ${users.length}
│ ✦ Speed : ${Date.now() - ctx.message.date * 1000}ms
│ ✦ Status : Online
│ ✦ Plugins : ${pluginsList.length}
│ ✦ Version : ${BOT_VERSION}
│ ✦ Time Now : ${now.toLocaleTimeString()}
│ ✦ Date Now : ${now.toLocaleDateString()}
│ ✦ Memory : ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB
╰───────────────────╯
╭━━【 𝐀𝐈 𝐌𝐄𝐍𝐔 】━━
┃ • chatgpt
┃ • gemini
┃ • deepseek
╰━━━━━━━━━━━━━━━
╭━━【 𝐆𝐀𝐌𝐄 𝐌𝐄𝐍𝐔 】━━
┃ • trivia
┃ • mathquiz
┃ • 8ball <q>
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
┃ • lyrics
┃ • weather
┃ • wallpaper
┃ • text2img
┃ • yts
╰━━━━━━━━━━━━━━━
╭━━【 𝐀𝐃𝐔𝐋𝐓 𝐌𝐄𝐍𝐔 】━━
┃ • xvideosearch
┃ • xnxxsearch
┃ • dl-xnxxvid
┃ • dl-xvideo
╰━━━━━━━━━━━━━━━
╭━━【𝐃𝐄𝐕 𝐌𝐄𝐍𝐔】━━
┃ • statics
┃ • listusers
┃ • setbanner <url>
┃ • setprefix <prefix>
┃ • setbotname <name>
┃ • broadcast <msg>
╰━━━━━━━━━━━━━━━

Powered by CYBIX DEVS
`.trim();
}

// === MENU TRIGGERS ===
const menuRegexes = [/^\/menu/i, /^\.menu/i, /^\/start/i, /^\.start/i, /^\/bot/i];
for (const regex of menuRegexes) {
  bot.hears(regex, async (ctx) => {
    registerUser(ctx);
    await sendBanner(ctx, getMenu(ctx));
  });
}

// === COMMAND PARSER ===
function parseCommand(text) {
  for (const prefix of PREFIXES) {
    if (text.startsWith(prefix)) {
      const [cmd, ...args] = text.slice(prefix.length).trim().split(/\s+/);
      return { cmd: cmd.toLowerCase(), args };
    }
  }
  return null;
}

// === DEV COMMANDS ===
bot.hears(/^([./])setprefix\s+(.+)/i, async (ctx) => {
  if (ctx.from.id.toString() !== OWNER_ID) return;
  let newPrefixes = ctx.match[2].split(/\s+/).filter(Boolean);
  if (!newPrefixes.length) return sendBanner(ctx, '❌ Provide at least one prefix.');
  PREFIXES = newPrefixes;
  await sendBanner(ctx, `✅ Prefix changed to: ${PREFIXES.join(' ')}`);
});

bot.hears(/^([./])setbanner\s+(.+)/i, async (ctx) => {
  if (ctx.from.id.toString() !== OWNER_ID) return;
  const url = ctx.match[2].trim();
  if (!url.match(/^https?:\/\/\S+$/)) return sendBanner(ctx, '❌ Provide a valid image URL.');
  BANNER_URL = url;
  await sendBanner(ctx, `✅ Banner image updated!`);
});

bot.hears(/^([./])setbotname\s+(.+)/i, async (ctx) => {
  if (ctx.from.id.toString() !== OWNER_ID) return;
  const name = ctx.match[2].trim();
  if (!name) return sendBanner(ctx, '❌ Provide a new bot name.');
  BOT_NAME = name;
  await sendBanner(ctx, `✅ Bot name updated to: ${name}`);
});

bot.hears(/^([./])broadcast\s+(.+)/i, async (ctx) => {
  if (ctx.from.id.toString() !== OWNER_ID) return sendBanner(ctx, '❌ Only owner can broadcast.');
  const msg = ctx.match[2].trim();
  let ok = 0, fail = 0;
  for (const u of users) {
    try {
      await bot.telegram.sendMessage(u.id, msg, { ...getChannelButtons() });
      ok++;
    } catch { fail++; }
  }
  await sendBanner(ctx, `✅ Broadcast completed:\nSuccess: ${ok}\nFailed: ${fail}`);
});

// === GAME COMMANDS ===
bot.hears(/^([./])trivia/i, async ctx => {
  try {
    let { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
    let q = data.results[0];
    let opts = [q.correct_answer, ...q.incorrect_answers].sort(() => Math.random() - 0.5);
    ctx.session = ctx.session || {}; ctx.session.trivia = q.correct_answer;
    await sendBanner(ctx, `🎲 *Trivia:*\n${q.question}\n${opts.map((x,i)=>`${i+1}. ${x}`).join('\n')}\nReply with .answer [answer]`);
  } catch { await sendBanner(ctx, 'Trivia API error.'); }
});
bot.hears(/^([./])mathquiz/i, async ctx => {
  let a = Math.floor(Math.random()*25)+1, b = Math.floor(Math.random()*25)+1;
  ctx.session = ctx.session || {}; ctx.session.math = a+b;
  await sendBanner(ctx, `🧮 What is ${a} + ${b}? Reply with .mathans [answer]`);
});
bot.hears(/^([./])8ball\s+(.+)/i, async ctx => {
  let q = ctx.match[2];
  try {
    let { data } = await axios.get('https://8ball.delegator.com/magic/JSON/' + encodeURIComponent(q));
    await sendBanner(ctx, `🎱 8Ball: ${data.magic.answer}`);
  } catch { await sendBanner(ctx, '8Ball API error.'); }
});
bot.hears(/^([./])answer\s+(.+)/i, async ctx => {
  if (ctx.session && ctx.session.trivia) {
    if (ctx.match[2].toLowerCase() === ctx.session.trivia.toLowerCase()) await sendBanner(ctx,"Correct!");
    else await sendBanner(ctx,"Wrong!");
    delete ctx.session.trivia;
  }
});
bot.hears(/^([./])mathans\s+(\d+)/i, async ctx => {
  if (ctx.session && ctx.session.math !== undefined) {
    if (parseInt(ctx.match[2]) === ctx.session.math) await sendBanner(ctx,"Correct!");
    else await sendBanner(ctx,"Wrong!");
    delete ctx.session.math;
  }
});

// === API RESPONSE FIELD PARSER ===
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

// === MAIN PLUGIN HANDLER ===
async function handleCommand(ctx, { cmd, args }) {
  // AI
  if (cmd === 'chatgpt' || cmd === 'gemini' || cmd === 'deepseek') {
    if (!args.length) return await sendBanner(ctx, `Usage: .${cmd} <prompt>`);
    let apiurl = cmd === 'chatgpt'
      ? 'https://api.princetechn.com/api/ai/gpt?apikey=prince&q='
      : cmd === 'gemini'
        ? 'https://api.princetechn.com/api/ai/geminiaipro?apikey=prince&q='
        : 'https://api.princetechn.com/api/ai/deepseek-v3?apikey=prince&q=';
    try {
      let { data } = await axios.get(apiurl + encodeURIComponent(args.join(' ')));
      let ans = getApiText(data);
      return await sendBanner(ctx, `🤖 ${cmd.charAt(0).toUpperCase()+cmd.slice(1)}:\n${ans}`);
    } catch (e) {
      return await sendBanner(ctx, `❌ ${cmd} API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
    }
  }
  // DL
  const DL_APIS = {
    apk: "https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=",
    spotify: "https://api.princetechn.com/api/download/spotifydlv2?apikey=prince&url=",
    gitclone: "https://api.princetechn.com/api/download/gitclone?apikey=prince&url=",
    play: "https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=",
    gdrive: "https://api.princetechn.com/api/download/gdrivedl?apikey=prince&url=",
  };
  if (Object.keys(DL_APIS).includes(cmd)) {
    if (!args.length) return await sendBanner(ctx, `Usage: .${cmd} <input>`);
    try {
      let { data } = await axios.get(DL_APIS[cmd] + encodeURIComponent(args.join(' ')));
      if(cmd==='play' && data.result && data.result.audio) {
        await ctx.replyWithAudio({ url: data.result.audio }, { title: data.result.title, ...getChannelButtons() });
        return true;
      }
      let ans = getApiText(data);
      return await sendBanner(ctx, `*${cmd.toUpperCase()}*:\n${ans}`);
    } catch (e) {
      return await sendBanner(ctx, `❌ ${cmd} API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
    }
  }
  // Other, Adult, Dev, etc
  switch (cmd) {
    case 'repo':
      return await sendBanner(ctx, `*Repo*: https://github.com/Dev-Ops610/cybix-telegram-bot`);
    case 'ping':
      return await sendBanner(ctx, `🏓 Pong!\nSpeed: ${Date.now() - ctx.message.date * 1000}ms`);
    case 'runtime':
      return await sendBanner(ctx, `⏱ Runtime: ${((process.uptime() / 60) | 0)}m ${(process.uptime() % 60 | 0)}s\nMemory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB`);
    case 'statics':
      return await sendBanner(ctx, `📊 Static Info:\nTotal Users: ${users.length}\nVersion: ${BOT_VERSION}\nOnline: CYBIX`);
    case 'listusers':
      return await sendBanner(ctx, '👥 Users:\n' + users.map(u => `${u.name} (${u.id})`).join('\n'));
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
          await ctx.replyWithPhoto({ url: img }, { caption: '🖼 Wallpaper', ...getChannelButtons() });
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
          await ctx.replyWithPhoto({ url: img }, { caption: '🎨 AI Image', ...getChannelButtons() });
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
    case 'xvideosearch':
    case 'xnxxsearch':
      if (!args.length) return await sendBanner(ctx, `Usage: .${cmd} <query>`);
      try {
        let url = cmd==='xvideosearch'
          ? `https://api.princetechn.com/api/search/xvideossearch?apikey=prince&query=`
          : `https://api.princetechn.com/api/search/xnxxsearch?apikey=prince&query=`;
        let { data } = await axios.get(url + encodeURIComponent(args.join(' ')));
        let ans = getApiText(data);
        return await sendBanner(ctx, `🔞 ${cmd.toUpperCase()}:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ ${cmd} API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    case 'dl-xnxxvid':
    case 'dl-xvideo':
      if (!args.length) return await sendBanner(ctx, `Usage: .${cmd} <url>`);
      try {
        let url = cmd==='dl-xnxxvid'
          ? `https://api.princetechn.com/api/download/xnxxdl?apikey=prince&url=`
          : `https://api.princetechn.com/api/download/xvideosdl?apikey=prince&url=`;
        let { data } = await axios.get(url + encodeURIComponent(args[0]));
        if (data.result && data.result.url) {
          await ctx.replyWithVideo({ url: data.result.url }, { ...getChannelButtons() });
          return true;
        }
        let ans = getApiText(data);
        return await sendBanner(ctx, `🔞 ${cmd.toUpperCase()}:\n${ans}`);
      } catch (e) {
        return await sendBanner(ctx, `❌ ${cmd} API error.\n${e.response?.data ? getApiText(e.response.data) : ''}`);
      }
    default: return false;
  }
}

// === MESSAGE HANDLER ===
bot.on('text', async (ctx, next) => {
  try {
    registerUser(ctx);
    const command = parseCommand(ctx.message.text);
    if (command) {
      let handled = await handleCommand(ctx, command);
      if (handled) return;
      await sendBanner(ctx, getMenu(ctx));
    }
  } catch (_) {}
  await next();
});

// === KEEPALIVE HTTP SERVER and SELF-PING to prevent sleep ===
const PORT = process.env.PORT || 3000;
http.createServer((_, res) => res.end('Bot is running')).listen(PORT);

bot.launch()
  .then(() => console.log('CYBIX BOT started.'))
  .catch(err => { console.error('Failed to start bot:', err); process.exit(1); });
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));