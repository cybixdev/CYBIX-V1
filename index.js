/**
 * Robust CYBIX V1 index.js
 * - Safe plugin loader
 * - Per-update error middleware (prevents uncaught plugin errors from sending error replies)
 * - Ensures utils/plugins folders and JSON files exist
 * - Optional tiny HTTP health endpoint (useful for Render)
 *
 * Replace your current index.js with this file. Keep your plugins/ directory as-is
 * (each plugin should export a function: module.exports = (bot, sendBannerAndButtons, OWNER_ID) => {...})
 */

require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID_RAW = process.env.OWNER_ID;
const OWNER_ID = OWNER_ID_RAW ? String(OWNER_ID_RAW).trim() : null;
const BANNER_URL = process.env.BANNER_URL || 'https://i.postimg.cc/L4NwW5WY/boykaxd.jpg';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000; // for health checks on hosts like Render

if (!BOT_TOKEN) {
  console.error('Fatal: BOT_TOKEN is not set in .env. Exiting.');
  process.exit(1);
}
if (!OWNER_ID) {
  console.error('Fatal: OWNER_ID is not set in .env. Exiting.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Ensure directories & default utils files exist
const ROOT = __dirname;
const UTILS_DIR = path.join(ROOT, 'utils');
const PLUGINS_DIR = path.join(ROOT, 'plugins');

if (!fs.existsSync(UTILS_DIR)) fs.mkdirSync(UTILS_DIR, { recursive: true });
if (!fs.existsSync(PLUGINS_DIR)) fs.mkdirSync(PLUGINS_DIR, { recursive: true });

const ensureJson = (filePath, defaultContent = '[]') => {
  if (!fs.existsSync(filePath)) {
    try { fs.writeFileSync(filePath, defaultContent, 'utf8'); }
    catch (e) { console.error(`Failed to create ${filePath}:`, e?.message || e); }
  }
};
ensureJson(path.join(UTILS_DIR, 'users.json'), '[]');
ensureJson(path.join(UTILS_DIR, 'groups.json'), '[]');
ensureJson(path.join(UTILS_DIR, 'premium.json'), '[]');

// sendBannerAndButtons: try photo, fallback to text; never throw
const sendBannerAndButtons = async (ctx, caption, extra = {}) => {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('Telegram Channel', 'https://t.me/cybixtech'), Markup.button.url('Support', 'https://t.me/cybixtech')]
  ]);
  try {
    if (ctx && ctx.replyWithPhoto) {
      return await ctx.replyWithPhoto(BANNER_URL, {
        caption,
        ...extra,
        ...keyboard
      });
    } else if (ctx && ctx.reply) {
      return await ctx.reply(caption, { ...extra, ...keyboard });
    }
  } catch (err) {
    // swallow and log - do not propagate to user to avoid "error occurred" messages
    console.error('sendBannerAndButtons error:', err?.message || err);
    try {
      if (ctx && ctx.reply) {
        // try a very simple fallback
        await ctx.reply(String(caption).slice(0, 4000));
      }
    } catch (e) {
      console.error('sendBannerAndButtons fallback also failed:', e?.message || e);
    }
  }
};

// Per-update error middleware: catches errors thrown inside plugins and prevents them from bubbling
bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // Log detailed stack to console only. Do NOT send raw error messages to users.
    console.error('Plugin/runtime error handling update:', {
      updateType: ctx.updateType,
      user: ctx.from ? { id: ctx.from.id, username: ctx.from.username } : undefined,
      error: err?.stack || err?.message || err
    });
    // Optionally send a gentle, non-technical message (commented out to avoid any error messages to users)
    // try { await ctx.reply('⚠️ Something went wrong processing your request. The issue has been logged.'); } catch {}
    // swallow error so bot.catch doesn't spam
  }
});

// Track users/groups (safe read/write with guards)
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
    // non-fatal tracking errors logged only
    console.error('User/group tracking exception:', e?.message || e);
  }
});

// Robust plugin loader: skip non-functions, catch init errors
const loadPlugins = () => {
  let files = [];
  try { files = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.js')); } catch (e) { console.error('Failed to read plugins dir:', e?.message || e); return; }
  for (const file of files) {
    const full = path.join(PLUGINS_DIR, file);
    try {
      const plugin = require(full);
      if (typeof plugin !== 'function') {
        console.warn(`Skipping plugin ${file}: module.exports is not a function`);
        continue;
      }
      try {
        if (plugin.length === 3) plugin(bot, sendBannerAndButtons, OWNER_ID);
        else if (plugin.length === 2) plugin(bot, sendBannerAndButtons);
        else plugin(bot);
        console.log(`Loaded plugin: ${file}`);
      } catch (initErr) {
        console.error(`Plugin ${file} initialization error:`, initErr?.message || initErr);
      }
    } catch (requireErr) {
      console.error(`Failed to require plugin ${file}:`, requireErr?.message || requireErr);
    }
  }
};

loadPlugins();

// bot.catch: log errors but avoid sending raw error messages to users
bot.catch((err, ctx) => {
  try {
    console.error('Bot.catch - unhandled error:', {
      updateType: ctx?.updateType,
      user: ctx?.from ? { id: ctx.from.id, username: ctx.from.username } : undefined,
      error: err?.stack || err?.message || err
    });
    // Do NOT reply with technical error info to users to avoid leaking internals.
    // If you want a brief user-friendly message, uncomment a single-line reply below:
    // try { ctx.reply('⚠️ An internal error occurred, it has been logged.'); } catch {}
  } catch (e) {
    console.error('Error inside bot.catch:', e?.message || e);
  }
});

// Optional tiny HTTP server for health check (useful/required on some platforms like Render)
try {
  const app = express();
  app.get('/', (req, res) => res.send('CYBIX V1 - OK'));
  app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
  app.listen(PORT, () => console.log(`Health server listening on port ${PORT}`));
} catch (e) {
  console.error('Failed to start health server:', e?.message || e);
}

// Unhandled rejection and uncaught exception handlers - log but try to keep process alive for short-term stability
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  // don't exit immediately; log and continue
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err?.stack || err?.message || err);
  // depending on severity you may want to exit; for now, we log and keep running
});

// Launch bot
(async () => {
  try {
    await bot.launch();
    console.log('CYBIX V1 Bot launched (polling).');
  } catch (e) {
    console.error('Failed to launch bot:', e?.message || e);
    process.exit(1);
  }
})();

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach(sig => {
  process.once(sig, async () => {
    console.log(`${sig} received: stopping bot...`);
    try { await bot.stop(); } catch (e) { console.error('Error stopping bot:', e?.message || e); }
    process.exit(0);
  });
});