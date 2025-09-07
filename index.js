require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const fs = require('fs');
const os = require('os');
const axios = require('axios');
const path = require('path');
const packageJson = require('./package.json');

// --- ENV ---
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const PORT = process.env.PORT || 8080;

// --- CONFIG ---
const CHANNEL_LINK = process.env.CHANNEL_LINK || 't.me://cybixtech';
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || 'cybixtech';
const WHATSAPP_LINK = process.env.WHATSAPP_LINK || 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X';
const REPO_URL = process.env.REPO_URL || 'https://github.com/Dev-Ops610/cybix-telegram-bot';
const OWNER_TAG = process.env.OWNER_TAG || '@cybixdev';
const BANNER_URL = process.env.BANNER_URL || 'https://files.catbox.moe/2x9p8j.jpg';

function getData() {
  try {
    return JSON.parse(fs.readFileSync('./data.json', 'utf8'));
  } catch {
    return { prefix: [".", "/"], botName: "CYBIX V1", banner: BANNER_URL };
  }
}
function getBotName() { return getData().botName || 'CYBIX V1'; }
function getPrefix() { return Array.isArray(getData().prefix) ? getData().prefix.join(' ') : getData().prefix || ". /"; }
function getBanner() { return getData().banner || BANNER_URL; }
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
    buttons: [
      [{ text: 'Telegram Channel', url: CHANNEL_LINK }],
      [{ text: 'WhatsApp Channel', url: WHATSAPP_LINK }]
    ]
  };
}

// --- USERS ---
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
  const existing = users.find(u => u.id === ctx.from.id);
  if (!existing) {
    users.push({ id: ctx.from.id, name: ctx.from.first_name || '', type: ctx.chat.type });
    saveUsers();
  } else if (existing.name !== ctx.from.first_name) {
    existing.name = ctx.from.first_name || '';
    saveUsers();
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
│ ✦ Users : ${users.length}
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

async function sendWithBanner(ctx, caption, opts = {}) {
  const { photo, buttons } = getBannerAndButtons();
  try {
    await ctx.replyWithPhoto({ url: photo }, {
      caption,
      parse_mode: opts.parse_mode || 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch (e) {
    await ctx.reply(caption, {
      parse_mode: opts.parse_mode || 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  }
}

// --- BOT INIT ---
if (!BOT_TOKEN || !OWNER_ID) {
  console.error('BOT_TOKEN and OWNER_ID must be set in .env');
  process.exit(1);
}
const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 60_000 });

async function requireChannelJoin(ctx, next) {
  if (!ctx.from || ctx.chat.type !== 'private') return next();
  try {
    const member = await ctx.telegram.getChatMember('@' + CHANNEL_USERNAME, ctx.from.id);
    const allowed = ['member', 'administrator', 'creator'];
    if (allowed.includes(member.status)) return next();
    await sendWithBanner(ctx, `🚫 *Join our Telegram Channel to use this bot!*\n\n[Join Channel](${CHANNEL_LINK})\n\nAfter joining, press /start again.`);
    return;
  } catch (e) {
    await sendWithBanner(ctx, `🚫 *Join our Telegram Channel to use this bot!*\n\n[Join Channel](${CHANNEL_LINK})\n\nAfter joining, press /start again.`);
    return;
  }
}
bot.use((ctx, next) => { saveUser(ctx); return next(); });
bot.use(requireChannelJoin);

// MENU
bot.hears(/^(\.|\/)(menu|start)$/i, async ctx => {
  await sendWithBanner(ctx, getMenu(ctx));
});

// -- AI MENU --
const aiApi = "https://api.princetechn.com/api/ai";
['chatgpt','openai','blackbox','gemini','deepseek'].forEach(cmd=>{
  bot.hears(new RegExp(`^(\\.|\\/)${cmd}\\s+(.+)$`, 'i'), async ctx => {
    try {
      const q = ctx.match[2];
      const { data } = await axios.get(`${aiApi}/${cmd}?apikey=prince&text=${encodeURIComponent(q)}`);
      await sendWithBanner(ctx, data.result || "No result.");
    } catch { await sendWithBanner(ctx, "API error!"); }
  });
});
bot.hears(/^(\.|\/)text2img\s+(.+)/i, async ctx => {
  try {
    const prompt = ctx.match[2];
    const { data } = await axios.get(`${aiApi}/text2img?apikey=prince&prompt=${encodeURIComponent(prompt)}`);
    if (data.result) {
      await ctx.replyWithPhoto({ url: data.result }, {
        caption: `Here is your image!\n\n${prompt}`,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: getBannerAndButtons().buttons }
      });
    } else await sendWithBanner(ctx, "No image.");
  } catch { await sendWithBanner(ctx, "API error!"); }
});

// -- DL MENU --
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
      if(cmd==='play' && data.result) {
        await ctx.replyWithAudio({ url: data.result }, {
          caption: `*Play*\n${data.result}`,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: getBannerAndButtons().buttons }
        });
      } else {
        await sendWithBanner(ctx, data.result ? `*${cmd.charAt(0).toUpperCase()+cmd.slice(1)}*\n${data.result}` : `No result.`);
      }
    } catch { await sendWithBanner(ctx, "API error!"); }
  });
});

// -- GAME MENU --
bot.hears(/^(\.|\/)trivia$/i, async ctx => {
  try {
    const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
    const q = res.data.results[0];
    const options = [q.correct_answer, ...q.incorrect_answers].sort(() => Math.random() - 0.5);
    ctx.session = ctx.session || {}; ctx.session.trivia = q.correct_answer;
    await sendWithBanner(ctx, `*Trivia:*\n${q.question}\nOptions: ${options.map((x,i)=>`\n${i+1}. ${x}`).join('')}\nReply with .answer [number]`);
  } catch { await sendWithBanner(ctx, "Trivia error."); }
});
bot.hears(/^(\.|\/)answer\s+(.+)/i, async ctx => {
  if (ctx.session && ctx.session.trivia) {
    if (ctx.match[2].toLowerCase() === ctx.session.trivia.toLowerCase()) {
      await sendWithBanner(ctx,"Correct!");
    } else await sendWithBanner(ctx,"Wrong!");
    delete ctx.session.trivia;
  }
});
bot.hears(/^(\.|\/)mathquiz$/i, async ctx => {
  const a = Math.floor(Math.random()*20)+1, b = Math.floor(Math.random()*20)+1;
  ctx.session = ctx.session || {}; ctx.session.math = a+b;
  await sendWithBanner(ctx,`What is ${a} + ${b}? Reply with .mathans [answer]`);
});
bot.hears(/^(\.|\/)mathans\s+(\d+)/i, async ctx => {
  if (ctx.session && ctx.session.math !== undefined) {
    if (parseInt(ctx.match[2]) === ctx.session.math) await sendWithBanner(ctx,"Correct!");
    else await sendWithBanner(ctx,"Wrong!");
    delete ctx.session.math;
  }
});
bot.hears(/^(\.|\/)8ball\s+(.+)/i, async ctx => {
  try {
    const res = await axios.get('https://8ball.delegator.com/magic/JSON/' + encodeURIComponent(ctx.match[2]));
    await sendWithBanner(ctx,res.data.magic.answer);
  } catch { await sendWithBanner(ctx,"API error!"); }
});

// -- PORN MENU --
bot.hears(/^(\.|\/)porn$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/pussy');
    await ctx.replyWithPhoto({ url: res.data.url }, {
      caption: 'Porn',
      reply_markup: { inline_keyboard: getBannerAndButtons().buttons }
    });
  } catch { await sendWithBanner(ctx,"API error!"); }
});
bot.hears(/^(\.|\/)ass$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/anal');
    await ctx.replyWithPhoto({ url: res.data.url }, {
      caption: 'Ass',
      reply_markup: { inline_keyboard: getBannerAndButtons().buttons }
    });
  } catch { await sendWithBanner(ctx,"API error!"); }
});
bot.hears(/^(\.|\/)boobs$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/boobs');
    await ctx.replyWithPhoto({ url: res.data.url }, {
      caption: 'Boobs',
      reply_markup: { inline_keyboard: getBannerAndButtons().buttons }
    });
  } catch { await sendWithBanner(ctx,"API error!"); }
});
bot.hears(/^(\.|\/)blowjob$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/blowjob');
    await ctx.replyWithPhoto({ url: res.data.url }, {
      caption: 'Blowjob',
      reply_markup: { inline_keyboard: getBannerAndButtons().buttons }
    });
  } catch { await sendWithBanner(ctx,"API error!"); }
});
bot.hears(/^(\.|\/)cum$/i, async ctx => {
  try {
    const res = await axios.get('https://nekos.life/api/v2/img/cum');
    await ctx.replyWithPhoto({ url: res.data.url }, {
      caption: 'Cum',
      reply_markup: { inline_keyboard: getBannerAndButtons().buttons }
    });
  } catch { await sendWithBanner(ctx,"API error!"); }
});

// -- OTHER MENU --
bot.hears(/^(\.|\/)repo$/i, async ctx => {
  await sendWithBanner(ctx, `*Bot Repo:*\n${REPO_URL}`);
});
bot.hears(/^(\.|\/)ping$/i, async ctx => {
  const start = Date.now();
  const sent = await ctx.reply('Pinging...');
  const ms = Date.now() - start;
  await ctx.deleteMessage(sent.message_id).catch(() => {});
  await sendWithBanner(ctx, `*Ping*: ${ms}ms`);
});
bot.hears(/^(\.|\/)runtime$/i, async ctx => {
  await sendWithBanner(ctx, `*Bot Uptime*\n${getUptime()}`);
});

// -- DEV MENU --
bot.hears(/^(\.|\/)statics$/i, async ctx => {
  const cpus = os.cpus().length;
  const mem = (os.totalmem() / 1024 / 1024).toFixed(0) + "MB";
  await sendWithBanner(ctx, `*Statics*\nCPU Cores: ${cpus}\nTotal Mem: ${mem}`);
});
bot.hears(/^(\.|\/)listusers$/i, async ctx => {
  if (!isOwner(ctx)) return;
  const list = users.map(u => `${u.name} (${u.id})`).join('\n') || "No users found.";
  await sendWithBanner(ctx, `*User List*\n${list}`);
});
bot.hears(/^(\.|\/)logs$/i, async ctx => {
  if (!isOwner(ctx)) return;
  await sendWithBanner(ctx, "*Logs*\nNo logs implemented (dev only).");
});
bot.hears(/^(\.|\/)broadcast\s+([\s\S]+)/i, async ctx => {
  if (!isOwner(ctx)) return sendWithBanner(ctx,"Not authorized.");
  const msg = ctx.match[2];
  let ok = 0, fail = 0;
  await sendWithBanner(ctx, "Broadcast started...");
  for (const u of users) {
    try {
      await bot.telegram.sendMessage(u.id, msg, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: getBannerAndButtons().buttons } });
      ok++;
    } catch { fail++; }
  }
  await sendWithBanner(ctx, `Broadcast finished!\nSuccess: ${ok}\nFailed: ${fail}`);
});
bot.hears(/^(\.|\/)setbanner\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  try {
    let data = getData();
    data.banner = ctx.match[2];
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    await sendWithBanner(ctx, "Banner updated (affects new menu replies).");
  } catch { await sendWithBanner(ctx, "Failed to update banner."); }
});
bot.hears(/^(\.|\/)setprefix\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  try {
    let data = getData();
    data.prefix = ctx.match[2].split(' ').filter(Boolean);
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    await sendWithBanner(ctx, `Prefix updated to: ${data.prefix.join(' ')}`);
  } catch { await sendWithBanner(ctx, "Failed to update prefix."); }
});
bot.hears(/^(\.|\/)setbotname\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  try {
    let data = getData();
    data.botName = ctx.match[2];
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    await sendWithBanner(ctx, `Bot name updated to: ${data.botName}`);
  } catch { await sendWithBanner(ctx, "Failed to update bot name."); }
});

// -- FALLBACK --
bot.on('message', async ctx => {
  if (
    ctx.message &&
    typeof ctx.message.text === 'string' &&
    (ctx.message.text.startsWith('.') || ctx.message.text.startsWith('/'))
  ) {
    await sendWithBanner(ctx, getMenu(ctx));
  }
});

// -- EXPRESS SERVER --
const app = express();
app.get('/', (req, res) => res.send('CYBIX BOT IS RUNNING'));
app.get('/ping', (req, res) => res.send('pong'));
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
})

bot.launch().then(()=>console.log('Bot started!')).catch(e=>console.error(e));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));