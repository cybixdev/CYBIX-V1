require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const fs = require('fs');
const os = require('os');
const axios = require('axios');
const path = require('path');
const packageJson = require('./package.json');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const PORT = process.env.PORT || 8080;
const CHANNEL_LINK = 'https://t.me/cybixtech';
const REPO_URL = 'https://github.com/Dev-Ops610/cybix-telegram-bot';
const OWNER_TAG = '@cybixdev';

function getData() {
  try {
    return JSON.parse(fs.readFileSync('./data.json', 'utf8'));
  } catch {
    return { prefix: [".", "/"], botName: "CYBIX V1", banner: "https://files.catbox.moe/7dozqn.jpg" };
  }
}
function getBotName() { return getData().botName || 'CYBIX V1'; }
function getPrefix() { return Array.isArray(getData().prefix) ? getData().prefix.join(' ') : getData().prefix || ". /"; }
function getBanner() { return getData().banner || "https://files.catbox.moe/7dozqn.jpg"; }
function getVersion() { return packageJson.version || '2.0.0'; }
function getUptime() {
  const uptime = process.uptime();
  const h = Math.floor(uptime / 3600);
  const m = Math.floor((uptime % 3600) / 60);
  const s = Math.floor(uptime % 60);
  return `${h}h ${m}m ${s}s`;
}
function getBannerAndButtons() {
  return {
    photo: getBanner(),
    buttons: [[{ text: 'Telegram Channel', url: CHANNEL_LINK }]]
  };
}

// User Tracking (expanded to track chats for broadcast)
const USERS_FILE = path.join(__dirname, 'users.json');
let users = [];
try { users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); } catch { users = []; }
function saveUser(ctx) {
  if (!ctx.from) return;
  if (!users.find(u => u.id === ctx.from.id)) {
    users.push({ id: ctx.from.id, name: ctx.from.first_name || '', type: ctx.chat.type });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
  // Save group/channel to users.json for broadcast
  if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup' || ctx.chat.type === 'channel')) {
    if (!users.find(u => u.id === ctx.chat.id)) {
      users.push({ id: ctx.chat.id, name: ctx.chat.title || '', type: ctx.chat.type });
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }
  }
}
function isOwner(ctx) {
  return ctx.from && ctx.from.id.toString() === OWNER_ID.toString();
}
function getMenu(ctx) {
  return (
`╭━───〔 ${getBotName()} 〕───━━╮
│ ✦ Prefix : ${getPrefix()}
│ ✦ Owner : ${OWNER_TAG}
│ ✦ User : ${ctx.from?.first_name || '-'}
│ ✦ User ID : ${ctx.from?.id || '-'}
│ ✦ Users : ${users.filter(u=>u.type==='private'||!u.type).length}
│ ✦ Speed : ${Math.floor(Math.random() * 10 + 1)}ms
│ ✦ Status : Online
│ ✦ Uptime : ${getUptime()}
│ ✦ Version : ${getVersion()}
│ ✦ RAM : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
╰───────────────────╯

╭━━【 𝐀𝐈 𝐌𝐄𝐍𝐔 】━━
┃ • .chatgpt <q>
┃ • .openai <q>
┃ • .blackbox <q>
┃ • .gemini <q>
┃ • .deepseek <q>
┃ • .text2img <prompt>
╰━━━━━━━━━━━━━━━

╭━━【 𝐃𝐋 𝐌𝐄𝐍𝐔 】━━
┃ • .apk <app>
┃ • .spotify <url>
┃ • .gitclone <url>
┃ • .mediafire <url>
┃ • .play <yt>
┃ • .gdrive <url>
╰━━━━━━━━━━━━━━━

╭━━【 𝐆𝐀𝐌𝐄 𝐌𝐄𝐍𝐔 】━━
┃ • .tictactoe @user
┃ • .rps @user
┃ • .trivia
┃ • .mathquiz
┃ • .8ball <q>
╰━━━━━━━━━━━━━━━

╭━━【 𝐇𝐄𝐍𝐓𝐀𝐈 𝐌𝐄𝐍𝐔 】━━
┃ • .hentai
┃ • .hentai_gif
┃ • .waifu
┃ • .neko
╰━━━━━━━━━━━━━━━

╭━━【 𝐏𝐎𝐑𝐍 𝐌𝐄𝐍𝐔 】━━
┃ • .porn
┃ • .ass
┃ • .boobs
┃ • .blowjob
┃ • .cum
╰━━━━━━━━━━━━━━━

╭━━【 𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔 】━━
┃ • .repo
┃ • .ping
┃ • .runtime
╰━━━━━━━━━━━━━━━

╭━━【 𝐀𝐃𝐔𝐋𝐓 𝐌𝐄𝐍𝐔 】━━
┃ • .xvideosearch <q>
┃ • .xnxxsearch <q>
┃ • .dl-xnxx <url>
┃ • .dl-xvideo <url>
╰━━━━━━━━━━━━━━━

╭━━【𝐃𝐄𝐕 𝐌𝐄𝐍𝐔】━━
┃ • .statics
┃ • .listusers
┃ • .logs
┃ • .broadcast <msg>
┃ • .setbanner <url>
┃ • .setprefix <pfx>
┃ • .setbotname <name>
╰━━━━━━━━━━━━━━━

Powered by CYBIX DEVS`
  );
}

// Init Bot & Save Users
const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 60_000 });
bot.use(async (ctx, next) => { saveUser(ctx); return next(); });

// === Menu command
bot.hears(/^(\.|\/)(menu|start)$/i, async ctx => {
  const { photo, buttons } = getBannerAndButtons();
  await ctx.replyWithPhoto({ url: photo }, {
    caption: getMenu(ctx),
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
});

// === AI MENU ===
bot.hears(/^(\.|\/)chatgpt\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/ai/chatgpt?apikey=prince&text=" + encodeURIComponent(ctx.match[2]));
    await ctx.reply(res.data.result || "No result.");
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)openai\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/ai/openai?apikey=prince&text=" + encodeURIComponent(ctx.match[2]));
    await ctx.reply(res.data.result || "No result.");
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)blackbox\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/ai/blackbox?apikey=prince&text=" + encodeURIComponent(ctx.match[2]));
    await ctx.reply(res.data.result || "No result.");
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)gemini\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/ai/gemini?apikey=prince&text=" + encodeURIComponent(ctx.match[2]));
    await ctx.reply(res.data.result || "No result.");
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)deepseek\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/ai/deepseek?apikey=prince&text=" + encodeURIComponent(ctx.match[2]));
    await ctx.reply(res.data.result || "No result.");
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)text2img\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/ai/text2img?apikey=prince&prompt=" + encodeURIComponent(ctx.match[2]));
    if (res.data.result) await ctx.replyWithPhoto({ url: res.data.result });
    else await ctx.reply("No image.");
  } catch { await ctx.reply("API error!"); }
});

// === DL MENU ===
bot.hears(/^(\.|\/)apk\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=" + encodeURIComponent(ctx.match[2]));
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: res.data.result ? `*APK Download*\n${res.data.result}` : "No APK found.",
      parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)spotify\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/download/spotifydlv2?apikey=prince&url=" + encodeURIComponent(ctx.match[2]));
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: res.data.result ? `*Spotify Download*\n${res.data.result}` : "Track not found.",
      parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)gitclone\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/download/gitclone?apikey=prince&url=" + encodeURIComponent(ctx.match[2]));
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: res.data.result ? `*Git Clone*\n${res.data.result}` : "Clone failed.",
      parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)mediafire\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/download/mediafire?apikey=prince&url=" + encodeURIComponent(ctx.match[2]));
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: res.data.result ? `*Mediafire Download*\n${res.data.result}` : "Mediafire file not found.",
      parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)play\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=" + encodeURIComponent(ctx.match[2]));
    const audioUrl = res.data.result;
    const { photo, buttons } = getBannerAndButtons();
    if (audioUrl) {
      await ctx.replyWithAudio({ url: audioUrl }, {
        caption: `*Play*\n${audioUrl}`,
        parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons }
      });
    } else {
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "No audio found.",
        parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons }
      });
    }
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)gdrive\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/download/gdrivedl?apikey=prince&url=" + encodeURIComponent(ctx.match[2]));
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: res.data.result ? `*GDrive Download*\n${res.data.result}` : "GDrive file not found.",
      parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply("API error!"); }
});

// === GAME MENU ===
// Trivia (public API)
bot.hears(/^(\.|\/)trivia$/i, async ctx => {
  try {
    const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
    const q = res.data.results[0];
    const options = [q.correct_answer, ...q.incorrect_answers].sort(() => Math.random() - 0.5);
    ctx.session = ctx.session || {}; ctx.session.trivia = q.correct_answer;
    ctx.replyWithMarkdown(`*Trivia:*\n${q.question}\nOptions: ${options.map((x,i)=>`\n${i+1}. ${x}`).join('')}\nReply with .answer [number]`);
  } catch { ctx.reply("Trivia error."); }
});
bot.hears(/^(\.|\/)answer\s+(.+)/i, async ctx => {
  if (ctx.session && ctx.session.trivia) {
    if (ctx.match[2].toLowerCase() === ctx.session.trivia.toLowerCase()) {
      ctx.reply("Correct!");
    } else ctx.reply("Wrong!");
    delete ctx.session.trivia;
  }
});
// Math Quiz (in-bot)
bot.hears(/^(\.|\/)mathquiz$/i, async ctx => {
  const a = Math.floor(Math.random()*20)+1, b = Math.floor(Math.random()*20)+1;
  ctx.session = ctx.session || {}; ctx.session.math = a+b;
  ctx.reply(`What is ${a} + ${b}? Reply with .mathans [answer]`);
});
bot.hears(/^(\.|\/)mathans\s+(\d+)/i, async ctx => {
  if (ctx.session && ctx.session.math !== undefined) {
    if (parseInt(ctx.match[2]) === ctx.session.math) ctx.reply("Correct!");
    else ctx.reply("Wrong!");
    delete ctx.session.math;
  }
});
// 8ball (public API)
bot.hears(/^(\.|\/)8ball\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get('https://8ball.delegator.com/magic/JSON/' + encodeURIComponent(ctx.match[2]));
    ctx.reply(res.data.magic.answer);
  } catch { ctx.reply("API error!"); }
});

// === HENTAI MENU (uses nekos.best, nekos.life, and some public APIs) ===
bot.hears(/^(\.|\/)hentai$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.best/api/v2/hentai');
    await ctx.replyWithPhoto({ url: res.data.results[0].url });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)hentai_gif$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/Random_hentai_gif');
    await ctx.replyWithAnimation({ url: res.data.url });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)waifu$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.best/api/v2/waifu');
    await ctx.replyWithPhoto({ url: res.data.results[0].url });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)neko$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.best/api/v2/neko');
    await ctx.replyWithPhoto({ url: res.data.results[0].url });
  } catch { await ctx.reply("API error!"); }
});

// === PORN MENU (uses some public APIs and placeholders) ===
bot.hears(/^(\.|\/)porn$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/pussy');
    await ctx.replyWithPhoto({ url: res.data.url });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)ass$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/anal');
    await ctx.replyWithPhoto({ url: res.data.url });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)boobs$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/boobs');
    await ctx.replyWithPhoto({ url: res.data.url });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)blowjob$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/blowjob');
    await ctx.replyWithPhoto({ url: res.data.url });
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)cum$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/cum');
    await ctx.replyWithPhoto({ url: res.data.url });
  } catch { await ctx.reply("API error!"); }
});

// === ADULT MENU ===
bot.hears(/^(\.|\/)xvideosearch\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/search/xvideossearch?apikey=prince&query=" + encodeURIComponent(ctx.match[2]));
    const links = (res.data.result || []).slice(0, 5).join('\n') || "No results.";
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: `*Xvideos Results*\n${links}`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply('API error!'); }
});
bot.hears(/^(\.|\/)xnxxsearch\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/search/xnxxsearch?apikey=prince&query=" + encodeURIComponent(ctx.match[2]));
    const links = (res.data.result || []).slice(0, 5).join('\n') || "No results.";
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: `*XNXX Results*\n${links}`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply('API error!'); }
});
bot.hears(/^(\.|\/)dl-xnxx\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/download/xnxxdl?apikey=prince&url=" + encodeURIComponent(ctx.match[2]));
    const vid = res.data.result || res.data.url || '';
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: vid ? `*XNXX Download*\n${vid}` : "No video found.",
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply('API error!'); }
});
bot.hears(/^(\.|\/)dl-xvideo\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get("https://api.princetechn.com/api/download/xvideosdl?apikey=prince&url=" + encodeURIComponent(ctx.match[2]));
    const vid = res.data.result || res.data.url || '';
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: vid ? `*Xvideos Download*\n${vid}` : "No video found.",
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply('API error!'); }
});

// === DEV MENU ===
bot.hears(/^(\.|\/)statics$/i, async ctx => {
  const cpus = os.cpus().length;
  const mem = (os.totalmem() / 1024 / 1024).toFixed(0) + "MB";
  const { photo, buttons } = getBannerAndButtons();
  await ctx.replyWithPhoto({ url: photo }, {
    caption: `*Statics*\nCPU Cores: ${cpus}\nTotal Mem: ${mem}`,
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
});
bot.hears(/^(\.|\/)listusers$/i, async ctx => {
  if (!isOwner(ctx)) return;
  const { photo, buttons } = getBannerAndButtons();
  const list = users.map(u => `${u.name} (${u.id})`).join('\n') || "No users found.";
  await ctx.replyWithPhoto({ url: photo }, {
    caption: `*User List*\n${list}`,
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
});
bot.hears(/^(\.|\/)logs$/i, async ctx => {
  if (!isOwner(ctx)) return;
  const { photo, buttons } = getBannerAndButtons();
  await ctx.replyWithPhoto({ url: photo }, {
    caption: "*Logs*\nNo logs implemented (dev only).",
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
});

// === BROADCAST COMMAND ===
bot.hears(/^(\.|\/)broadcast\s+([\s\S]+)/i, async ctx => {
  if (!isOwner(ctx)) return ctx.reply("Not authorized.");
  const msg = ctx.match[2];
  let ok = 0, fail = 0;
  ctx.reply("Broadcast started...");
  for (const u of users) {
    try {
      if (u.type === 'channel') await bot.telegram.sendMessage(u.id, msg, { parse_mode: 'Markdown' });
      else if (u.type === 'group' || u.type === 'supergroup') await bot.telegram.sendMessage(u.id, msg, { parse_mode: 'Markdown' });
      else await bot.telegram.sendMessage(u.id, msg, { parse_mode: 'Markdown' });
      ok++;
    } catch { fail++; }
  }
  ctx.reply(`Broadcast finished!\nSuccess: ${ok}\nFailed: ${fail}`);
});

bot.hears(/^(\.|\/)setbanner\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  try {
    let data = getData();
    data.banner = ctx.match[2];
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    await ctx.reply("Banner updated (affects new menu replies).");
  } catch { await ctx.reply("Failed to update banner."); }
});
bot.hears(/^(\.|\/)setprefix\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  try {
    let data = getData();
    data.prefix = ctx.match[2].split(' ').filter(Boolean);
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    await ctx.reply(`Prefix updated to: ${data.prefix.join(' ')}`);
  } catch { await ctx.reply("Failed to update prefix."); }
});
bot.hears(/^(\.|\/)setbotname\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  try {
    let data = getData();
    data.botName = ctx.match[2];
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    await ctx.reply(`Bot name updated to: ${data.botName}`);
  } catch { await ctx.reply("Failed to update bot name."); }
});

// === Fallback for unrecognized commands
bot.on('message', async ctx => {
  if (
    ctx.message &&
    typeof ctx.message.text === 'string' &&
    (ctx.message.text.startsWith('.') || ctx.message.text.startsWith('/'))
  ) {
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: getMenu(ctx),
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  }
});

// Express Server for Render/any host
const app = express();
app.get('/', (req, res) => res.send('CYBIX BOT IS RUNNING'));
app.get('/ping', (req, res) => res.send('pong'));
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));