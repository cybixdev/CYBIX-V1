/**
 * CYBIX V1 - Robust entrypoint with safe JSON handling
 *
 * Fixes:
 * - "users.find is not a function" by validating and sanitizing utils JSON files
 * - Ensures user/group tracking never throws and cannot block other handlers
 * - Keeps previous hardening: no user-facing raw error replies, optional express health server
 *
 * Replace your current index.js with this file, restart the service on Render, and watch logs.
 */

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

// Paths
const ROOT = __dirname;
const UTILS_DIR = path.join(ROOT, 'utils');
const PLUGINS_DIR = path.join(ROOT, 'plugins');

// Ensure folders exist
if (!fs.existsSync(UTILS_DIR)) fs.mkdirSync(UTILS_DIR, { recursive: true });
if (!fs.existsSync(PLUGINS_DIR)) fs.mkdirSync(PLUGINS_DIR, { recursive: true });

// Safe JSON helpers
function safeReadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw || !raw.trim()) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`safeReadJson parse error for ${filePath}:`, e?.message || e);
    return null;
  }
}

function safeWriteJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`safeWriteJson write error for ${filePath}:`, e?.message || e);
    return false;
  }
}

/**
 * Ensure the given utils file contains an Array.
 * If file is missing or corrupt or contains a non-array, this will rewrite it to [].
 * It attempts to salvage common wrapped shapes like { users: [...] } or { data: [...] }.
 */
function ensureArrayFile(filePath) {
  let parsed = safeReadJson(filePath);
  if (Array.isArray(parsed)) return; // OK
  
  // salvage attempt
  if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.users)) {
      safeWriteJson(filePath, parsed.users);
      console.warn(`${path.basename(filePath)} contained { users: [...] } — salvaged to array.`);
      return;
    }
    if (Array.isArray(parsed.data)) {
      safeWriteJson(filePath, parsed.data);
      console.warn(`${path.basename(filePath)} contained { data: [...] } — salvaged to array.`);
      return;
    }
  }
  
  // Overwrite with empty array if anything else
  console.warn(`${path.basename(filePath)} is missing or invalid — resetting to []`);
  safeWriteJson(filePath, []);
}

// Ensure required files exist and are valid arrays
ensureArrayFile(path.join(UTILS_DIR, 'users.json'));
ensureArrayFile(path.join(UTILS_DIR, 'groups.json'));
ensureArrayFile(path.join(UTILS_DIR, 'premium.json'));

// sendBannerAndButtons: defensive (never throw)
const sendBannerAndButtons = async (ctx, caption, extra = {}) => {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('Telegram Channel', 'https://t.me/cybixtech'), Markup.button.url('Support', 'https://t.me/cybixtech')]
  ]);
  try {
    if (ctx && typeof ctx.replyWithPhoto === 'function') {
      return await ctx.replyWithPhoto(BANNER_URL, { caption, ...extra, ...keyboard });
    }
    if (ctx && typeof ctx.reply === 'function') {
      return await ctx.reply(String(caption).slice(0, 4096), { ...extra, ...keyboard });
    }
  } catch (err) {
    console.error('sendBannerAndButtons error:', err?.message || err);
    try {
      if (ctx && typeof ctx.reply === 'function') {
        await ctx.reply(String(caption).slice(0, 1900));
      }
    } catch (e) {
      console.error('sendBannerAndButtons fallback failed:', e?.message || e);
    }
  }
};

// Per-update middleware: catch plugin errors and log only (do not reply to users)
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
      console.error('Failed to log update error:', loggingErr?.message || loggingErr);
    }
    // swallow the error to avoid any user-facing generic error messages
  }
});

// User/group tracking - made fully defensive and non-blocking
bot.on('message', async ctx => {
  try {
    const user = ctx.from;
    if (!user || !user.id) return;
    
    const usersPath = path.join(UTILS_DIR, 'users.json');
    const groupsPath = path.join(UTILS_DIR, 'groups.json');
    
    // Read and sanitize users array
    let users = safeReadJson(usersPath);
    if (!Array.isArray(users)) {
      console.warn('users.json invalid at message-time — sanitizing');
      ensureArrayFile(usersPath);
      users = [];
    }
    
    // Add user if missing
    const existsUser = users.find(u => String(u.id) === String(user.id));
    if (!existsUser) {
      users.push({ id: user.id, username: user.username || null, first_name: user.first_name || null, added_at: Date.now() });
      safeWriteJson(usersPath, users);
    }
    
    // Groups
    const chatType = ctx.chat?.type;
    if (chatType === 'group' || chatType === 'supergroup') {
      let groups = safeReadJson(groupsPath);
      if (!Array.isArray(groups)) {
        console.warn('groups.json invalid at message-time — sanitizing');
        ensureArrayFile(groupsPath);
        groups = [];
      }
      const existsGroup = groups.find(g => String(g.id) === String(ctx.chat.id));
      if (!existsGroup) {
        groups.push({ id: ctx.chat.id, title: ctx.chat.title || null, added_at: Date.now() });
        safeWriteJson(groupsPath, groups);
      }
    }
  } catch (e) {
    // Log only — MUST NOT throw
    console.error('User/group tracking error:', e?.message || e);
  }
});

// Plugin loader (robust)
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
        console.error(`Plugin ${file} initialization error:`, initErr?.stack || initErr?.message || initErr);
      }
    } catch (requireErr) {
      console.error(`Failed to require plugin ${file}:`, requireErr?.stack || requireErr?.message || requireErr);
    }
  }
};

loadPlugins();

// bot.catch: log only
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

// Optional lightweight health server only if express is installed
let expressAppStarted = false;
try {
  const express = require('express');
  const app = express();
  app.get('/', (req, res) => res.send('CYBIX V1 - OK'));
  app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
  app.listen(PORT, () => {
    expressAppStarted = true;
    console.log(`Health server listening on port ${PORT}`);
  });
} catch (e) {
  console.log('Express not present; skipping health server (this is fine).');
}

// Global unhandled logging
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err?.stack || err?.message || err);
});

// Launch bot
(async () => {
  try {
    await bot.launch();
    console.log('CYBIX V1 Bot launched and running.');
    if (!expressAppStarted) console.log('Health server not running (express not installed).');
  } catch (e) {
    console.error('Failed to launch bot:', e?.stack || e?.message || e);
    process.exit(1);
  }
})();

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach(sig => {
  process.once(sig, async () => {
    console.log(`${sig} received, stopping bot...`);
    try { await bot.stop(); } catch (e) { console.error('Error stopping bot:', e?.message || e); }
    process.exit(0);
  });
});

// Export for tests or external use
module.exports = { bot, sendBannerAndButtons, ensureArrayFile };