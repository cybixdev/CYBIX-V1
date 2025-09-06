require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const express = require('express');
const { readConfig, writeConfig } = require('./config');
const { isOwner, getMenuCaption, getBannerAndButtons } = require('./utils');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const PORT = process.env.PORT || 8080;
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || 'cybixtech';
const SELF_URL = process.env.SELF_URL;

if (!BOT_TOKEN || !OWNER_ID || !CHANNEL_USERNAME) {
  console.error('BOT_TOKEN, OWNER_ID, and CHANNEL_USERNAME must be set in .env');
  process.exit(1);
}
const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 60_000 });

// === PLUGINS MANAGEMENT (PLUGINS ARE OPTIONAL) ===
const pluginsDir = path.join(__dirname, 'plugins');
let loadedPlugins = [];
function loadPlugins(bot) {
  loadedPlugins = [];
  if (!fs.existsSync(pluginsDir)) return;
  const walk = dir => {
    fs.readdirSync(dir).forEach(file => {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) return walk(full);
      if (file.endsWith('.js')) {
        try {
          require(full)(bot);
          loadedPlugins.push(full.replace(__dirname, ''));
        } catch (e) {
          console.error(`Plugin error [${file}]:`, e);
        }
      }
    });
  };
  walk(pluginsDir);
}
loadPlugins(bot);

// === USERS TRACKING ===
const userFile = path.join(__dirname, 'users.json');
let users = [];
try {
  users = JSON.parse(fs.readFileSync(userFile, 'utf8'));
} catch {
  users = [];
}
function saveUser(id, name) {
  if (!users.find(u => u.id === id)) {
    users.push({ id, name });
    fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
  }
}

// === CHANNEL ENFORCEMENT ===
async function inChannel(ctx) {
  try {
    const res = await ctx.telegram.getChatMember('@' + CHANNEL_USERNAME, ctx.from.id);
    return ['member', 'administrator', 'creator'].includes(res.status);
  } catch {
    return false;
  }
}
async function blockIfNotJoined(ctx, next) {
  if (await inChannel(ctx)) return next();
  const { photo, buttons } = getBannerAndButtons();
  await ctx.replyWithPhoto(
    { url: photo },
    {
      caption: `🚫 *Access Denied*\n\nJoin our official Telegram and WhatsApp Channel to use this bot!`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    }
  );
}

// === SEND WITH BANNER + BUTTONS ===
async function sendWithBanner(ctx, caption, extra = {}) {
  const { photo, buttons } = getBannerAndButtons();
  await ctx.replyWithPhoto(
    { url: photo },
    {
      caption,
      parse_mode: 'Markdown',
      ...extra,
      reply_markup: { inline_keyboard: buttons }
    }
  );
}

// === MIDDLEWARE ===
bot.use(async (ctx, next) => {
  if (ctx.from) saveUser(ctx.from.id, ctx.from.first_name || '');
  return next();
});
bot.use(blockIfNotJoined);

// === CORE COMMANDS (MENU HANDLER) ===
const menuTriggers = [
  '/start', '/menu', '.menu', '.bot'
];
for (const trigger of menuTriggers) {
  bot.hears(new RegExp(`^${trigger.replace('.', '\\.')}(\\s+|$)`, 'i'), async ctx => {
    const config = readConfig();
    config.plugins = loadedPlugins.length;
    config.ownerName = ctx.botInfo?.username || 'Owner';
    await sendWithBanner(ctx, getMenuCaption(ctx, config, users));
  });
}

// Prefix change (owner only)
bot.hears(/^(\.|\/)setprefix\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  const [, , newPref] = ctx.message.text.match(/^(\.|\/)setprefix\s+(.+)/i) || [];
  if (!newPref) return ctx.reply('Specify a new prefix.');
  let prefixArr = newPref.split(' ').filter(Boolean);
  writeConfig({ prefix: prefixArr });
  await ctx.reply(`Prefix updated to: ${prefixArr.join(' ')}`);
});

// Bot name change (owner only)
bot.hears(/^(\.|\/)setbotname\s+(.+)/i, async ctx => {
  if (!isOwner(ctx)) return;
  const [, , newName] = ctx.message.text.match(/^(\.|\/)setbotname\s+(.+)/i) || [];
  if (!newName) return ctx.reply('Specify a new bot name.');
  writeConfig({ botName: newName });
  await ctx.reply(`Bot name updated to: ${newName}`);
});

// Plugins: dynamic command handler (reserved for future use)

// Fallback for other messages
bot.on('message', async ctx => {
  await sendWithBanner(ctx, 'Send a command to see the menu.');
});

// === SELF-PINGING TO KEEP ALIVE ===
if (SELF_URL) {
  setInterval(() => {
    axios.get(SELF_URL + '/ping').catch(()=>{});
  }, 1000 * 60 * 5);
}

const app = express();
app.get('/', (req, res) => res.send('CYBIX BOT IS RUNNING'));
app.get('/ping', (req, res) => res.send('pong'));
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));