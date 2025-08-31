require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// ENV
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const BANNER_URL = 'https://i.postimg.cc/L4NwW5WY/boykaxd.jpg';

// Validate ENV
if (!BOT_TOKEN || !OWNER_ID) {
  throw new Error('BOT_TOKEN and OWNER_ID must be set in .env!');
}

const bot = new Telegraf(BOT_TOKEN);

// Ensure utils directory exists
const utilsDir = path.join(__dirname, 'utils');
if (!fs.existsSync(utilsDir)) {
  fs.mkdirSync(utilsDir, { recursive: true });
}

// Safe read/write helpers
const safeReadJSON = (filepath, fallback = []) => {
  try {
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error(`Failed to read ${filepath}:`, e);
  }
  return fallback;
};

const safeWriteJSON = (filepath, obj) => {
  try {
    fs.writeFileSync(filepath, JSON.stringify(obj, null, 2));
  } catch (e) {
    console.error(`Failed to write ${filepath}:`, e);
  }
};

// Banner/buttons sending, fallback to text if photo fails
const sendBannerAndButtons = async (ctx, caption, extra = {}) => {
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.url('Whatsapp Channel', 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X'),
      Markup.button.url('Telegram Channel', 'https://t.me/cybixtech')
    ]
  ]);
  try {
    return await ctx.replyWithPhoto(BANNER_URL, {
      caption,
      ...extra,
      ...keyboard
    });
  } catch (err) {
    console.error('Banner send failed, fallback to text:', err);
    return ctx.reply(caption, keyboard);
  }
};

// Track users/groups for stats
bot.on('message', async ctx => {
  const user = ctx.from;
  const chat = ctx.chat;
  
  // Track user
  const usersPath = path.join(utilsDir, 'users.json');
  let users = safeReadJSON(usersPath);
  if (!users.some(u => u.id === user.id)) {
    users.push({ id: user.id, username: user.username || null });
    safeWriteJSON(usersPath, users);
  }
  
  // Track groups
  if (['group', 'supergroup'].includes(chat.type)) {
    const groupsPath = path.join(utilsDir, 'groups.json');
    let groups = safeReadJSON(groupsPath);
    if (!groups.some(g => g.id === chat.id)) {
      groups.push({ id: chat.id, title: chat.title || null });
      safeWriteJSON(groupsPath, groups);
    }
  }
});

// Load plugins safely
const pluginsDir = path.join(__dirname, 'plugins');
if (fs.existsSync(pluginsDir)) {
  fs.readdirSync(pluginsDir)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const pluginPath = path.join(pluginsDir, file);
      try {
        require(pluginPath)(bot, sendBannerAndButtons, OWNER_ID);
      } catch (err) {
        console.error(`Failed to load plugin ${file}:`, err);
      }
    });
} else {
  console.warn(`Plugins directory "${pluginsDir}" does not exist.`);
}

// Error handler
bot.catch((err, ctx) => {
  console.error(`Bot error for ${ctx.updateType}:`, err);
  if (ctx.reply) {
    ctx.reply('❌ An unexpected error occurred. Please try again!');
  }
});

bot.launch()
  .then(() => console.log('CYBIX V1 Bot is running!'))
  .catch(err => {
    console.error('Bot failed to launch:', err);
    process.exit(1);
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));