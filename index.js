require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID_RAW = process.env.OWNER_ID;
const OWNER_ID = OWNER_ID_RAW ? String(OWNER_ID_RAW).trim() : null;
const BANNER_URL = process.env.BANNER_URL || 'https://i.postimg.cc/L4NwW5WY/boykaxd.jpg';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

if (!BOT_TOKEN) {
  console.error('Fatal: BOT_TOKEN is not set in environment. Exiting.');
  process.exit(1);
}
if (!OWNER_ID) {
  console.error('Fatal: OWNER_ID is not set in environment. Exiting.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Ensure directories & default JSON files exist
const ROOT = __dirname;
const UTILS_DIR = path.join(ROOT, 'utils');
const PLUGINS_DIR = path.join(ROOT, 'plugins');

if (!fs.existsSync(UTILS_DIR)) fs.mkdirSync(UTILS_DIR, { recursive: true });
if (!fs.existsSync(PLUGINS_DIR)) fs.mkdirSync(PLUGINS_DIR, { recursive: true });

const ensureJson = (p, defaultContent = '[]') => {
  if (!fs.existsSync(p)) {
    try { fs.writeFileSync(p, defaultContent, 'utf8'); }
    catch (e) { console.error(`Failed to create ${p}:`, e?.message || e); }
  }
};
ensureJson(path.join(UTILS_DIR, 'users.json'), '[]');
ensureJson(path.join(UTILS_DIR, 'groups.json'), '[]');
ensureJson(path.join(UTILS_DIR, 'premium.json'), '[]');

// Safe sendBannerAndButtons: never throws outward
const sendBannerAndButtons = async (ctx, caption, extra = {}) => {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('Telegram Channel', 'https://t.me/cybixtech'), Markup.button.url('Support', 'https://t.me/cybixtech')]
  ]);
  try {
    if (ctx && typeof ctx.replyWithPhoto === 'function') {
      return await ctx.replyWithPhoto(BANNER_URL, { caption, ...extra, ...keyboard });
    }
    if (ctx && typeof ctx.reply === 'function') {
      return await ctx.reply(caption, { ...extra, ...keyboard });
    }
  } catch (err) {
    console.error('sendBannerAndButtons error:', err?.stack || err?.message || err);
    try {
      if (ctx && typeof ctx.reply === 'function') {
        await ctx.reply(String(caption).slice(0, 4000));
      }
    } catch (e) {
      console.error('sendBannerAndButtons fallback failed:', e?.message || e);
    }
  }
};

// Per-update error middleware: logs errors but does NOT reply to users
bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    try {
      console.error('Update handler error:', {
        updateType: ctx.updateType,
        user: ctx.from ? { id: ctx.from.id, username: ctx.from.username || null } : null,
        chat: ctx.chat ? { id: ctx.chat.id, type: ctx.chat.type } : null,
        error: err?.stack || err?.message || err
      });
    } catch (loggingErr) {
      console.error('Error while logging update error:', loggingErr?.message || loggingErr);
    }
    // swallow error (do not forward to user)
  }
});

// Track users and groups safely
bot.on('message', async ctx => {
  try {
    const user = ctx.from;
    if (!user || !user.id) return;
    const usersPath = path.join(UTILS_DIR, 'users.json');
    const groupsPath = path.join(UTILS_DIR, 'groups.json');
    
    let users = [];
    try { users = JSON.parse(fs.readFileSync(usersPath, 'utf8') || '[]'); } catch { users = []; }
    if (!users.find(u => String(u.id) === String(user.id))) {
      users.push({ id: user.id, username: user.username || null, first_name: user.first_name || null });
      try { fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf8'); } catch (e) { console.error('Failed to write users.json:', e?.message || e); }
    }
    
    const chatType = ctx.chat?.type;
    if (chatType === 'group' || chatType === 'supergroup') {
      let groups = [];
      try { groups = JSON.parse(fs.readFileSync(groupsPath, 'utf8') || '[]'); } catch { groups = []; }
      if (!groups.find(g => String(g.id) === String(ctx.chat.id))) {
        groups.push({ id: ctx.chat.id, title: ctx.chat.title || null });
        try { fs.writeFileSync(groupsPath, JSON.stringify(groups, null, 2), 'utf8'); } catch (e) { console.error('Failed to write groups.json:', e?.message || e); }
      }
    }
  } catch (e) {
    console.error('User/group tracking error:', e?.message || e);
  }
});

// Robust plugin loader
const loadPlugins = () => {
  let list = [];
  try { list = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.js')); } catch (e) { console.error('Failed to read plugins directory:', e?.message || e); return; }
  for (const file of list) {
    const full = path.join(PLUGINS_DIR, file);
    try {
      const plugin = require(full);
      if (typeof plugin !== 'function') {
        console.warn(`Plugin ${file} skipped: module.exports is not a function`);
        continue;
      }
      try {
        if (plugin.length === 3) plugin(bot, sendBannerAndButtons, OWNER_ID);
        else if (plugin.length === 2) plugin(bot, sendBannerAndButtons);
        else plugin(bot);
        console.log(`Loaded plugin: ${file}`);
      } catch (initErr) {
        console.error(`Plugin ${file} initialization error:`, initErr?.stack || initErr?.message || initErr);
      }
    } catch (requireErr) {
      console.error(`Failed to require plugin ${file}:`, requireErr?.stack || requireErr?.message || requireErr);
    }
  }
};

loadPlugins();

// bot.catch logs only, never replies to user
bot.catch((err, ctx) => {
  try {
    console.error('bot.catch - unhandled error:', {
      updateType: ctx?.updateType,
      from: ctx?.from ? { id: ctx.from.id, username: ctx.from.username } : null,
      error: err?.stack || err?.message || err
    });
  } catch (e) {
    console.error('Error inside bot.catch:', e?.message || e);
  }
});

// Optional express health server: require express only if present (no crash if missing)
let expressAppStarted = false;
try {
  // try to require express; if it's not installed, this will throw and we skip creating the server
  const express = require('express');
  const app = express();
  app.get('/', (req, res) => res.send('CYBIX V1 - OK'));
  app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
  app.listen(PORT, () => {
    expressAppStarted = true;
    console.log(`Health server listening on port ${PORT}`);
  });
} catch (e) {
  console.warn('Express not installed or failed to start - skipping health server. To enable it, run: npm install express');
}

// Global unhandled problem logging (do not reply to users)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err?.stack || err?.message || err);
});

(async () => {
  try {
    await bot.launch();
    console.log('CYBIX V1 Bot launched and running.');
    if (!expressAppStarted) console.log('Note: health server not running (express missing).');
  } catch (e) {
    console.error('Failed to launch bot:', e?.stack || e?.message || e);
    process.exit(1);
  }
})();

// graceful shutdown
['SIGINT', 'SIGTERM'].forEach(sig => {
  process.once(sig, async () => {
    console.log(`${sig} received, stopping bot...`);
    try { await bot.stop(); } catch (e) { console.error('Error stopping bot:', e?.message || e); }
    process.exit(0);
  });
});

module.exports = { bot, sendBannerAndButtons };