require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const API_URL = process.env.API_URL;
const CODE_EXPIRY_MINUTES = 3;

const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X";
const TELEGRAM_CHANNEL = "https://t.me/cybixtech";
const WEBSITE_LINK = "https://cybixtech.onrender.com";
const BANNER_URL = "https://files.catbox.moe/p6f8el.jpg";

const bot = new Telegraf(BOT_TOKEN);

// Session store (for multi-step flows)
const sessions = {}; // user_id: { action, timestamp }

function channelButtons() {
  return Markup.inlineKeyboard([
    [Markup.button.url('WhatsApp Channel', WHATSAPP_CHANNEL)],
    [Markup.button.url('Telegram Channel', TELEGRAM_CHANNEL)],
    [Markup.button.url('CYBIX TECH Website', WEBSITE_LINK)]
  ]);
}

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('Sign Up', 'signup')],
    [Markup.button.callback('Forgot Password', 'forgot')],
    [Markup.button.callback('💎 Premium Info', 'premium')],
    [Markup.button.callback('Help', 'help')]
  ]);
}

function ownerMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('Add Premium', 'addprem')]
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

async function sendBanner(ctx, text, extraButtons = mainMenu()) {
  try {
    await ctx.replyWithPhoto(BANNER_URL, {
      caption: text,
      ...channelButtons()
    });
    await ctx.reply('Choose an option:', extraButtons);
  } catch {
    await ctx.reply(text, channelButtons());
    await ctx.reply('Choose an option:', extraButtons);
  }
}

// Entry point
bot.start(async (ctx) => {
  let intro = `👋 Welcome to CYBIX TECH Bot!\nWhat do you want to do?\n`;
  if (isOwner(ctx)) intro += "\n(Owner mode enabled)";
  await sendBanner(ctx, intro, isOwner(ctx) ? ownerMenu() : mainMenu());
});

// Main menu button handlers
bot.action('signup', async (ctx) => {
  sessions[ctx.from.id] = { action: 'signup', timestamp: Date.now() };
  await sendBanner(ctx, '🔒 Enter your email for sign-up:');
});
bot.action('forgot', async (ctx) => {
  sessions[ctx.from.id] = { action: 'forgot', timestamp: Date.now() };
  await sendBanner(ctx, '🔑 Enter your registered email to reset password:');
});
bot.action('premium', async (ctx) => {
  await sendBanner(ctx, `💎 Premium lets you upload ZIP/files, batch obfuscate/deobfuscate.\nContact @cybixdev to buy premium. Owner will activate for 1 month.`);
});
bot.action('help', async (ctx) => {
  await sendBanner(
    ctx,
    `🚀 CYBIX TECH Bot Help:\n• Sign Up: Get sign-up code\n• Forgot Password: Reset password\n• Premium Info: Details about premium\n• Owner-only: Add Premium button (if owner)`
  );
});
bot.action('addprem', async (ctx) => {
  if (!isOwner(ctx)) return sendBanner(ctx, '❌ Only owner can use this.');
  sessions[ctx.from.id] = { action: 'addprem', timestamp: Date.now() };
  await sendBanner(ctx, 'Enter the email to grant premium access:');
});

// Handle text for all flows
bot.on('text', async (ctx) => {
  const session = sessions[ctx.from.id];
  if (!session || !session.action) {
    return sendBanner(
      ctx,
      'Please use the menu below to interact with CYBIX TECH Bot.',
      isOwner(ctx) ? ownerMenu() : mainMenu()
    );
  }
  
  const email = ctx.message.text.trim().toLowerCase();
  if (session.action === 'addprem' && isOwner(ctx)) {
    // Owner granting premium
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      return sendBanner(ctx, '❌ Invalid email format. Try again.', ownerMenu());
    }
    try {
      await axios.post(`${API_URL}/admin/add-premium`, { email });
      await sendBanner(ctx, `✅ Premium added for ${email}.`, ownerMenu());
    } catch (e) {
      await sendBanner(ctx, '❌ Failed to add premium. Check API or email.', ownerMenu());
    }
    delete sessions[ctx.from.id];
    return;
  }
  
  // Validate email format for signup/forgot
  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return sendBanner(ctx, '❌ Invalid email format. Try again.');
  }
  
  try {
    const res = await axios.post(`${API_URL}/user/check`, { email });
    const exists = res.data.exists;
    
    if (session.action === 'signup') {
      if (exists) return sendBanner(ctx, '❌ Email already exists. Please log in or use Forgot Password.');
      const code = generateCode();
      await axios.post(`${API_URL}/telegram/code`, { email, code, type: 'signup' });
      await sendBanner(
        ctx,
        `✅ Your sign-up code: *${code}* (valid for ${CODE_EXPIRY_MINUTES} minutes)\nPaste this code in the website sign-up form.\n\nGet code again from the menu.`,
        mainMenu()
      );
    } else if (session.action === 'forgot') {
      if (!exists) return sendBanner(ctx, '❌ No account with this email. Try Sign Up.');
      const code = generateCode();
      await axios.post(`${API_URL}/telegram/code`, { email, code, type: 'forgot' });
      await sendBanner(
        ctx,
        `🔑 Password reset code: *${code}* (valid for ${CODE_EXPIRY_MINUTES} minutes)\nEnter it on the website.\n\nGet code again from the menu.`,
        mainMenu()
      );
    }
    delete sessions[ctx.from.id];
  } catch (e) {
    await sendBanner(ctx, '❌ Error connecting to API. Try again later.');
    delete sessions[ctx.from.id];
  }
});

// Error Handling
bot.catch((err, ctx) => {
  console.error('Bot error', err);
  sendBanner(ctx, '⚠️ An error occurred, please try again.');
});

// For Render/Vercel keepalive
if (process.env.PORT) {
  require('http').createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is running');
  }).listen(process.env.PORT);
}

bot.launch();
console.log('CYBIX TECH Telegram Bot running...');