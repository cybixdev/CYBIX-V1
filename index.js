require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const moment = require('moment');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const API_URL = process.env.API_URL;
const CODE_EXPIRY_MINUTES = 3;

const bot = new Telegraf(BOT_TOKEN);

// Channel/website links
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X";
const TELEGRAM_CHANNEL = "https://t.me/cybixtech";
const WEBSITE_LINK = "https://cybixtech.onrender.com";
const BANNER_URL = "https://files.catbox.moe/qo8oso.jpg";

// Session store (for multi-step flows)
const sessions = {}; // user_id: { action, timestamp }

function channelButtons() {
  return Markup.inlineKeyboard([
    [Markup.button.url('WhatsApp Channel', WHATSAPP_CHANNEL)],
    [Markup.button.url('Telegram Channel', TELEGRAM_CHANNEL)],
    [Markup.button.url('CYBIX TECH Website', WEBSITE_LINK)]
  ]);
}

function isOwner(ctx) {
  return String(ctx.from.id) === String(OWNER_ID);
}

// Helper: Generate random 6-char code
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Send banner and buttons
async function sendBanner(ctx, text) {
  try {
    await ctx.replyWithPhoto(BANNER_URL, {
      caption: text,
      ...channelButtons()
    });
  } catch {
    await ctx.reply(text, channelButtons());
  }
}

// Start/menu
bot.start(async (ctx) => {
  await sendBanner(ctx, `👋 Welcome to CYBIX TECH Bot!
What do you want to do?
1️⃣ Sign Up (/signup)
2️⃣ Forgot Password (/forgot)
💎 Premium info (/premium)
/help for all commands.`);
});

// Help
bot.help(async (ctx) => {
  await ctx.reply(`🚀 CYBIX TECH Bot Commands:
/signup - Get sign-up code
/forgot - Reset password
/premium - Premium info
/addprem <email> - Owner only: add premium
/help - Show help`);
  await sendBanner(ctx, 'Quick links:');
});

// /signup - sign-up code flow
bot.command('signup', async (ctx) => {
  sessions[ctx.from.id] = { action: 'signup', timestamp: Date.now() };
  await ctx.reply('🔒 Enter your email for sign-up:');
});

// /forgot - password reset flow
bot.command('forgot', async (ctx) => {
  sessions[ctx.from.id] = { action: 'forgot', timestamp: Date.now() };
  await ctx.reply('🔑 Enter your registered email to reset password:');
});

// /premium - info & contact owner
bot.command('premium', async (ctx) => {
  await sendBanner(ctx, `💎 Premium lets you upload ZIP/files, batch obfuscate/deobfuscate.
Contact @cybixdev to buy premium. Owner will activate for 1 month.`);
});

// /addprem <email> - owner only
bot.command('addprem', async (ctx) => {
  if (!isOwner(ctx)) return ctx.reply('❌ Only owner can use this.');
  const args = ctx.message.text.split(' ');
  if (args.length < 2) return ctx.reply('Usage: /addprem <email>');
  const email = args[1].trim().toLowerCase();
  try {
    await axios.post(`${API_URL}/admin/add-premium`, { email });
    await ctx.reply(`✅ Premium added for ${email}.`);
  } catch (e) {
    await ctx.reply('❌ Failed to add premium. Check API or email.');
  }
});

// Handle text for signup/forgot flows
bot.on('text', async (ctx) => {
  const session = sessions[ctx.from.id];
  if (!session || !session.action) return;
  const email = ctx.message.text.trim().toLowerCase();
  
  // Validate email format
  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return ctx.reply('❌ Invalid email format. Try again.');
  }
  
  try {
    const res = await axios.post(`${API_URL}/user/check`, { email });
    const exists = res.data.exists;
    
    if (session.action === 'signup') {
      if (exists) return ctx.reply('❌ Email already exists. Please log in or use /forgot.');
      const code = generateCode();
      await axios.post(`${API_URL}/telegram/code`, { email, code, type: 'signup' });
      await ctx.reply(`✅ Your sign-up code: *${code}* (valid for ${CODE_EXPIRY_MINUTES} minutes)\nPaste this code in the website sign-up form.\n\nGet code again: /signup`, { parse_mode: 'Markdown' });
      await sendBanner(ctx, 'Need help? Join channels below.');
    } else if (session.action === 'forgot') {
      if (!exists) return ctx.reply('❌ No account with this email. Try /signup.');
      const code = generateCode();
      await axios.post(`${API_URL}/telegram/code`, { email, code, type: 'forgot' });
      await ctx.reply(`🔑 Password reset code: *${code}* (valid for ${CODE_EXPIRY_MINUTES} minutes)\nEnter it on the website.\n\nGet code again: /forgot`, { parse_mode: 'Markdown' });
      await sendBanner(ctx, 'Join our community:');
    }
    delete sessions[ctx.from.id];
  } catch (e) {
    await ctx.reply('❌ Error connecting to API. Try again later.');
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error', err);
  ctx.reply('⚠️ An error occurred, please try again.');
});

// Launch bot
bot.launch();
console.log('CYBIX TECH Telegram Bot running...');

// For Render/Vercel keepalive
if (process.env.PORT) {
  require('http').createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is running');
  }).listen(process.env.PORT);
}