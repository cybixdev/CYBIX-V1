require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const fs = require('fs');
const os = require('os');
const axios = require('axios');
const path = require('path');
const packageJson = require('./package.json');

// === ENV ===
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const PORT = process.env.PORT || 8080;
const CHANNEL_LINK = 'https://t.me/cybixtech';
const REPO_URL = 'https://github.com/Dev-Ops610/cybix-telegram-bot';
const OWNER_TAG = '@cybixdev';

// === CONFIG ===
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

// === USERS ===
const USERS_FILE = path.join(__dirname, 'users.json');
let users = [];
function loadUsers() {
  try { users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); } catch { users = []; }
}
function saveUsers() {
  try { fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); } catch {}
}
loadUsers();
function saveUser(ctx) {
  if (!ctx.from) return;
  if (!users.find(u => u.id === ctx.from.id)) {
    users.push({ id: ctx.from.id, name: ctx.from.first_name || '', type: ctx.chat.type });
    saveUsers();
  }
  if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup' || ctx.chat.type === 'channel')) {
    if (!users.find(u => u.id === ctx.chat.id)) {
      users.push({ id: ctx.chat.id, name: ctx.chat.title || '', type: ctx.chat.type });
      saveUsers();
    }
  }
}
function isOwner(ctx) {
  return ctx.from && ctx.from.id && ctx.from.id.toString() === OWNER_ID.toString();
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

// === BOT INIT ===
if (!BOT_TOKEN || !OWNER_ID) {
  console.error('BOT_TOKEN and OWNER_ID must be set in .env');
  process.exit(1);
}
const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 60_000 });
bot.use(async (ctx, next) => { saveUser(ctx); return next(); });

// === MENU ===
bot.hears(/^(\.|\/)(menu|start)$/i, async ctx => {
  try {
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: getMenu(ctx),
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch (e) { await ctx.reply(getMenu(ctx)); }
});

// === AI MENU ===
const aiApi = "https://api.princetechn.com/api/ai";
['chatgpt','openai','blackbox','gemini','deepseek'].forEach(cmd=>{
  bot.hears(new RegExp(`^(\\.|\\/)${cmd}\\s+(.+)$`, 'i'), async ctx => {
    try {
      const q = ctx.match[2];
      const { data } = await axios.get(`${aiApi}/${cmd}?apikey=prince&text=${encodeURIComponent(q)}`);
      await ctx.reply(data.result || "No result.");
    } catch { await ctx.reply("API error!"); }
  });
});
bot.hears(/^(\.|\/)text2img\s+(.+)/i, async ctx => {
  try {
    const prompt = ctx.match[2];
    const { data } = await axios.get(`${aiApi}/text2img?apikey=prince&prompt=${encodeURIComponent(prompt)}`);
    if (data.result) await ctx.replyWithPhoto({ url: data.result });
    else await ctx.reply("No image.");
  } catch { await ctx.reply("API error!"); }
});

// === DL MENU ===
const dlApi = "https://api.princetechn.com/api/download";
const dlCmds = {
  apk: "apkdl?apikey=prince&appName=",
  spotify: "spotifydlv2?apikey=prince&url=",
  gitclone: "gitclone?apikey=prince&url=",
  mediafire: "mediafire?apikey=prince&url=",
  play: "ytmp3?apikey=prince&url=",
  gdrive: "gdrivedl?apikey=prince&url="
};
Object.entries(dlCmds).forEach(([cmd, url])=>{
  bot.hears(new RegExp(`^(\\.|\\/)${cmd}\\s+(.+)$`, 'i'), async ctx => {
    try {
      const q = ctx.match[2];
      const { data } = await axios.get(`${dlApi}/${url}${encodeURIComponent(q)}`);
      const { photo, buttons } = getBannerAndButtons();
      if(cmd==='play' && data.result) {
        await ctx.replyWithAudio({ url: data.result }, {
          caption: `*Play*\n${data.result}`,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: buttons }
        });
      } else {
        await ctx.replyWithPhoto({ url: photo }, {
          caption: data.result ? `*${cmd.charAt(0).toUpperCase()+cmd.slice(1)}*\n${data.result}` : `No result.`,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: buttons }
        });
      }
    } catch { await ctx.reply("API error!"); }
  });
});

// === GAME MENU ===
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
bot.hears(/^(\.|\/)8ball\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get('https://8ball.delegator.com/magic/JSON/' + encodeURIComponent(ctx.match[2]));
    ctx.reply(res.data.magic.answer);
  } catch { ctx.reply("API error!"); }
});

// === HENTAI MENU ===
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

// === PORN MENU ===
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
const adultApi = "https://api.princetechn.com/api";
bot.hears(/^(\.|\/)xvideosearch\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get(`${adultApi}/search/xvideossearch?apikey=prince&query=${encodeURIComponent(ctx.match[2])}`);
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
    const res = await axios.get(`${adultApi}/search/xnxxsearch?apikey=prince&query=${encodeURIComponent(ctx.match[2])}`);
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
    const res = await axios.get(`${adultApi}/download/xnxxdl?apikey=prince&url=${encodeURIComponent(ctx.match[2])}`);
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
    const res = await axios.get(`${adultApi}/download/xvideosdl?apikey=prince&url=${encodeURIComponent(ctx.match[2])}`);
    const vid = res.data.result || res.data.url || '';
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: vid ? `*Xvideos Download*\n${vid}` : "No video found.",
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply('API error!'); }
});

// === OTHER MENU ===
bot.hears(/^(\.|\/)repo$/i, async ctx => {
  const { photo, buttons } = getBannerAndButtons();
  await ctx.replyWithPhoto({ url: photo }, {
    caption: `*Bot Repo:*\n${REPO_URL}`,
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
});
bot.hears(/^(\.|\/)ping$/i, async ctx => {
  const start = Date.now();
  const sent = await ctx.reply('Pinging...');
  const ms = Date.now() - start;
  await ctx.deleteMessage(sent.message_id).catch(() => {});
  const { photo, buttons } = getBannerAndButtons();
  await ctx.replyWithPhoto({ url: photo }, {
    caption: `*Ping*: ${ms}ms`,
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
});
bot.hears(/^(\.|\/)runtime$/i, async ctx => {
  const { photo, buttons } = getBannerAndButtons();
  await ctx.replyWithPhoto({ url: photo }, {
    caption: `*Bot Uptime*\n${getUptime()}`,
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
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
bot.hears(/^(\.|\/)broadcast\s+([\s\S]+)/i, async ctx => {
  if (!isOwner(ctx)) return ctx.reply("Not authorized.");
  const msg = ctx.match[2];
  let ok = 0, fail = 0;
  ctx.reply("Broadcast started...");
  for (const u of users) {
    try {
      await bot.telegram.sendMessage(u.id, msg, { parse_mode: 'Markdown' }).catch(()=>{});
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
    try {
      const { photo, buttons } = getBannerAndButtons();
      await ctx.replyWithPhoto({ url: photo }, {
        caption: getMenu(ctx),
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } catch { await ctx.reply(getMenu(ctx)); }
  }
});

// === EXPRESS SERVER ===
const app = express();
app.get('/', (req, res) => res.send('CYBIX BOT IS RUNNING'));
app.get('/ping', (req, res) => res.send('pong'));
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

bot.launch().then(()=>console.log('Bot started!')).catch(e=>console.error(e));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));