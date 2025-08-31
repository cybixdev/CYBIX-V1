require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const BANNER_URL = 'https://i.postimg.cc/L4NwW5WY/boykaxd.jpg';

if (!BOT_TOKEN || !OWNER_ID) throw new Error('BOT_TOKEN and OWNER_ID must be set in .env!');

const bot = new Telegraf(BOT_TOKEN);

const sendBannerAndButtons = async (ctx, caption, extra = {}) => {
  try {
    return await ctx.replyWithPhoto(BANNER_URL, {
      caption,
      ...extra,
      ...Markup.inlineKeyboard([
        [
          Markup.button.url('Whatsapp Channel', 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X'),
          Markup.button.url('Telegram Channel', 'https://t.me/cybixtech')
        ]
      ])
    });
  } catch {
    return ctx.reply(caption, Markup.inlineKeyboard([
      [
        Markup.button.url('Whatsapp Channel', 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X'),
        Markup.button.url('Telegram Channel', 'https://t.me/cybixtech')
      ]
    ]));
  }
};

// Track users/groups for stats
bot.on('message', async ctx => {
  const user = ctx.from;
  let users = [];
  try { users = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils/users.json'))); } catch { users = []; }
  if (!users.find(u => u.id === user.id)) {
    users.push({ id: user.id, username: user.username || null });
    fs.writeFileSync(path.join(__dirname, 'utils/users.json'), JSON.stringify(users, null, 2));
  }
  if (['group', 'supergroup'].includes(ctx.chat.type)) {
    let groups = [];
    try { groups = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils/groups.json'))); } catch { groups = []; }
    if (!groups.find(g => g.id === ctx.chat.id)) {
      groups.push({ id: ctx.chat.id, title: ctx.chat.title || null });
      fs.writeFileSync(path.join(__dirname, 'utils/groups.json'), JSON.stringify(groups, null, 2));
    }
  }
});

// Load all plugins
const pluginsDir = path.join(__dirname, 'plugins');
fs.readdirSync(pluginsDir)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    require(path.join(pluginsDir, file))(bot, sendBannerAndButtons, OWNER_ID);
  });

bot.catch((err, ctx) => {
  console.error(`Bot error for ${ctx.updateType}`, err);
  ctx.reply('❌ An unexpected error occurred. Please try again!');
});

bot.launch();
console.log('CYBIX V1 Bot is running!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));