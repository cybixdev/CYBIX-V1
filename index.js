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
const BANNER = 'https://files.catbox.moe/wtibiq.jpg';
const REPO_URL = 'https://github.com/JadenAfrix1';
const OWNER_TAG = '@cybixdev';

if (!BOT_TOKEN || !OWNER_ID) {
  console.error('BOT_TOKEN and OWNER_ID must be set in .env');
  process.exit(1);
}
const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 60_000 });

const USERS_FILE = path.join(__dirname, 'users.json');
let users = [];
try {
  users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
} catch { users = []; }
function saveUser(ctx) {
  if (!ctx.from) return;
  if (!users.find(u => u.id === ctx.from.id)) {
    users.push({ id: ctx.from.id, name: ctx.from.first_name || '' });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
}
function isOwner(ctx) {
  return ctx.from && ctx.from.id.toString() === OWNER_ID.toString();
}

// DYNAMIC CONFIG
function getBotName() {
  try {
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    return data.botName || 'CYBIX V1';
  } catch { return 'CYBIX V1'; }
}
function getPrefix() {
  try {
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    if (Array.isArray(data.prefix)) return data.prefix.join(' ');
    return data.prefix || ". /";
  } catch { return ". /"; }
}
function getBanner() {
  try {
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    return data.banner || BANNER;
  } catch { return BANNER; }
}
function getVersion() {
  return packageJson.version || '2.0.0';
}
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
┃ • .tictactoe @user
┃ • .rps @user
┃ • .trivia
┃ • .mathquiz
┃ • .8ball <q>
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
┃ • .setbanner <url>
┃ • .setprefix <pfx>
┃ • .setbotname <name>
╰━━━━━━━━━━━━━━━

Powered by CYBIX DEVS`
  );
}

// MIDDLEWARE: Save users
bot.use(async (ctx, next) => { saveUser(ctx); return next(); });

// MENU
bot.hears(/^(\.|\/)(menu|start)$/i, async ctx => {
  const { photo, buttons } = getBannerAndButtons();
  await ctx.replyWithPhoto({ url: photo }, {
    caption: getMenu(ctx),
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
});

// === AI MENU (your provided APIs) ===
bot.hears(/^(\.|\/)chatgpt\s+(.+)/i, async ctx => {
  const q = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/ai/chatgpt?apikey=prince&text=" + encodeURIComponent(q));
    await ctx.reply(data.result || "No result.");
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)openai\s+(.+)/i, async ctx => {
  const q = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/ai/openai?apikey=prince&text=" + encodeURIComponent(q));
    await ctx.reply(data.result || "No result.");
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)blackbox\s+(.+)/i, async ctx => {
  const q = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/ai/blackbox?apikey=prince&text=" + encodeURIComponent(q));
    await ctx.reply(data.result || "No result.");
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)gemini\s+(.+)/i, async ctx => {
  const q = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/ai/gemini?apikey=prince&text=" + encodeURIComponent(q));
    await ctx.reply(data.result || "No result.");
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)deepseek\s+(.+)/i, async ctx => {
  const q = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/ai/deepseek?apikey=prince&text=" + encodeURIComponent(q));
    await ctx.reply(data.result || "No result.");
  } catch { await ctx.reply("API error!"); }
});
bot.hears(/^(\.|\/)text2img\s+(.+)/i, async ctx => {
  const prompt = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/ai/text2img?apikey=prince&prompt=" + encodeURIComponent(prompt));
    await ctx.replyWithPhoto({ url: data.result });
  } catch { await ctx.reply("API error!"); }
});

// === DL MENU (your provided APIs) ===
bot.hears(/^(\.|\/)apk\s+(.+)/i, async ctx => {
  const app = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=" + encodeURIComponent(app));
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: data.result ? `*APK Download for ${app}*\n${data.result}` : "No APK found.",
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply('API error!'); }
});
bot.hears(/^(\.|\/)spotify\s+(.+)/i, async ctx => {
  const url = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/download/spotifydlv2?apikey=prince&url=" + encodeURIComponent(url));
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: data.result ? `*Spotify Download*\n${data.result}` : "Track not found.",
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply('API error!'); }
});
bot.hears(/^(\.|\/)gitclone\s+(.+)/i, async ctx => {
  const url = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/download/gitclone?apikey=prince&url=" + encodeURIComponent(url));
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: data.result ? `*Git Clone*\n${data.result}` : "Clone failed.",
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply('API error!'); }
});
bot.hears(/^(\.|\/)mediafire\s+(.+)/i, async ctx => {
  const url = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/download/mediafire?apikey=prince&url=" + encodeURIComponent(url));
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: data.result ? `*Mediafire Download*\n${data.result}` : "Mediafire file not found.",
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply('API error!'); }
});
bot.hears(/^(\.|\/)play\s+(.+)/i, async ctx => {
  const url = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=" + encodeURIComponent(url));
    const audioUrl = data.result;
    const { photo, buttons } = getBannerAndButtons();
    if (audioUrl) {
      await ctx.replyWithAudio({ url: audioUrl }, {
        caption: `*Play*\n${audioUrl}`,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    } else {
      await ctx.replyWithPhoto({ url: photo }, {
        caption: "No audio found.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
    }
  } catch { await ctx.reply('API error!'); }
});
bot.hears(/^(\.|\/)gdrive\s+(.+)/i, async ctx => {
  const url = ctx.match[2];
  try {
    const { data } = await axios.get("https://api.princetechn.com/api/download/gdrivedl?apikey=prince&url=" + encodeURIComponent(url));
    const { photo, buttons } = getBannerAndButtons();
    await ctx.replyWithPhoto({ url: photo }, {
      caption: data.result ? `*GDrive Download*\n${data.result}` : "GDrive file not found.",
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } catch { await ctx.reply('API error!'); }
});

// === GAME MENU (public APIs or in-bot logic) ===

// Tic Tac Toe (in-bot logic)
let tttGames = {};
bot.hears(/^(\.|\/)tictactoe\s+@?(\w+)/i, async ctx => {
  const challenger = ctx.from.id;
  const opponent = ctx.message.entities?.find(e => e.type === "mention");
  if (!opponent) return ctx.reply("Mention your opponent with @username.");
  const opUsername = ctx.message.text.split(' ')[1].replace('@', '');
  if (opUsername.toLowerCase() === ctx.from.username?.toLowerCase()) return ctx.reply("You can't play with yourself!");
  let oppId;
  try {
    const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, opUsername);
    oppId = chatMember.user.id;
  } catch { return ctx.reply("Opponent must be in this chat."); }
  const gameId = `${challenger}_${oppId}_${Date.now()}`;
  tttGames[gameId] = {
    board: Array(9).fill(' '),
    turn: challenger,
    challenger,
    opponent: oppId,
    usernames: {
      [challenger]: ctx.from.username || ctx.from.first_name,
      [oppId]: opUsername
    }
  };
  ctx.replyWithMarkdown(`TicTacToe started! <b>${ctx.from.first_name}</b> vs <b>@${opUsername}</b>\nType .move [1-9] to play.\n\n${drawBoard(tttGames[gameId].board)}`);
  tttGames[challenger] = gameId;
  tttGames[oppId] = gameId;
});
function drawBoard(board) {
  const s = board.map((v,i)=>v===' '?`${i+1}`:v);
  return `\n${s[0]} | ${s[1]} | ${s[2]}\n---------\n${s[3]} | ${s[4]} | ${s[5]}\n---------\n${s[6]} | ${s[7]} | ${s[8]}`;
}
function checkWin(board, token) {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(line=>line.every(i=>board[i]===token));
}
bot.hears(/^(\.|\/)move\s+([1-9])$/i, async ctx => {
  const userId = ctx.from.id;
  const gameId = tttGames[userId];
  if (!gameId || !tttGames[gameId]) return ctx.reply("No game found.");
  const game = tttGames[gameId];
  if (game.turn !== userId) return ctx.reply("Not your turn.");
  const idx = parseInt(ctx.match[2])-1;
  if (game.board[idx] !== ' ') return ctx.reply("Cell already filled.");
  const token = userId === game.challenger ? '❌' : '⭕';
  game.board[idx] = token;
  if (checkWin(game.board, token)) {
    ctx.replyWithMarkdown(`Game Over! <b>${game.usernames[userId]}</b> wins!\n${drawBoard(game.board)}`);
    delete tttGames[gameId]; delete tttGames[game.challenger]; delete tttGames[game.opponent];
    return;
  }
  if (game.board.every(v=>v!==' ')) {
    ctx.replyWithMarkdown(`Draw!\n${drawBoard(game.board)}`);
    delete tttGames[gameId]; delete tttGames[game.challenger]; delete tttGames[game.opponent];
    return;
  }
  game.turn = userId === game.challenger ? game.opponent : game.challenger;
  ctx.replyWithMarkdown(`Next turn: <b>${game.usernames[game.turn]}</b>\n${drawBoard(game.board)}`);
});

// Rock Paper Scissors (in-bot logic)
let rpsGames = {};
bot.hears(/^(\.|\/)rps\s+@?(\w+)/i, async ctx => {
  const challenger = ctx.from.id;
  const opUsername = ctx.message.text.split(' ')[1].replace('@', '');
  if (opUsername.toLowerCase() === ctx.from.username?.toLowerCase()) return ctx.reply("You can't play with yourself!");
  let oppId;
  try {
    const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, opUsername);
    oppId = chatMember.user.id;
  } catch { return ctx.reply("Opponent must be in this chat."); }
  const gameId = `${challenger}_${oppId}_${Date.now()}`;
  rpsGames[gameId] = { challenger, oppId, moves: {} };
  ctx.reply(`RPS: <b>${ctx.from.first_name}</b> vs <b>@${opUsername}</b>\nBoth type .rpsmove [rock|paper|scissors]`);
  rpsGames[challenger] = gameId; rpsGames[oppId] = gameId;
});
bot.hears(/^(\.|\/)rpsmove\s+(rock|paper|scissors)$/i, async ctx => {
  const userId = ctx.from.id;
  const gameId = rpsGames[userId];
  if (!gameId || !rpsGames[gameId]) return ctx.reply("No game found.");
  const game = rpsGames[gameId];
  game.moves[userId] = ctx.match[2];
  if (Object.keys(game.moves).length === 2) {
    const [a, b] = [game.challenger, game.oppId];
    const [m1, m2] = [game.moves[a], game.moves[b]];
    let result = "Draw!";
    if (m1 !== m2) {
      if ((m1 === "rock" && m2 === "scissors") || (m1 === "paper" && m2 === "rock") || (m1 === "scissors" && m2 === "paper")) result = `${ctx.from.first_name} wins!`;
      else result = "Opponent wins!";
    }
    ctx.reply(`Result: ${result}\n${a}: ${m1}\n${b}: ${m2}`);
    delete rpsGames[gameId]; delete rpsGames[a]; delete rpsGames[b];
  } else ctx.reply("Move submitted. Waiting for opponent.");
});

// Trivia (public API)
bot.hears(/^(\.|\/)trivia$/i, async ctx => {
  try {
    const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
    const q = res.data.results[0];
    const options = [q.correct_answer, ...q.incorrect_answers].sort(() => Math.random() - 0.5);
    ctx.replyWithMarkdown(`*Trivia:*\n${q.question}\nOptions: ${options.map((x,i)=>`\n${i+1}. ${x}`).join('')}\nReply with .answer [number]`);
    ctx.session = ctx.session || {}; ctx.session.trivia = q.correct_answer;
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

// === ADULT MENU (your APIs) ===
bot.hears(/^(\.|\/)xvideosearch\s+(.+)/i, async ctx => {
  const query = ctx.match[2];
  try {
    const res = await axios.get("https://api.princetechn.com/api/search/xvideossearch?apikey=prince&query=" + encodeURIComponent(query));
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
  const query = ctx.match[2];
  try {
    const res = await axios.get("https://api.princetechn.com/api/search/xnxxsearch?apikey=prince&query=" + encodeURIComponent(query));
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
  const url = ctx.match[2];
  try {
    const res = await axios.get("https://api.princetechn.com/api/download/xnxxdl?apikey=prince&url=" + encodeURIComponent(url));
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
  const url = ctx.match[2];
  try {
    const res = await axios.get("https://api.princetechn.com/api/download/xvideosdl?apikey=prince&url=" + encodeURIComponent(url));
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
bot.hears(/^(\.|\/)setbanner\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  const url = ctx.match[2];
  try {
    let data = {};
    try { data = JSON.parse(fs.readFileSync('./data.json', 'utf8')); } catch {}
    data.banner = url;
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    await ctx.reply("Banner updated (affects new menu replies).");
  } catch { await ctx.reply("Failed to update banner."); }
});
bot.hears(/^(\.|\/)setprefix\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  const pfx = ctx.match[2];
  try {
    let data = {};
    try { data = JSON.parse(fs.readFileSync('./data.json', 'utf8')); } catch {}
    data.prefix = pfx.split(' ').filter(Boolean);
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    await ctx.reply(`Prefix updated to: ${data.prefix.join(' ')}`);
  } catch { await ctx.reply("Failed to update prefix."); }
});
bot.hears(/^(\.|\/)setbotname\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  const newName = ctx.match[2];
  try {
    let data = {};
    try { data = JSON.parse(fs.readFileSync('./data.json', 'utf8')); } catch {}
    data.botName = newName;
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    await ctx.reply(`Bot name updated to: ${newName}`);
  } catch { await ctx.reply("Failed to update bot name."); }
});

// FALLBACK
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

// EXPRESS SERVER
const app = express();
app.get('/', (req, res) => res.send('CYBIX BOT IS RUNNING'));
app.get('/ping', (req, res) => res.send('pong'));
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));