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

function mainMenu(isOwner = false) {
  // Unified menu for all users, owner sees extra button
  const buttons = [
    [Markup.button.callback('Sign Up', 'signup')],
    [Markup.button.callback('Forgot Password', 'forgot')],
    [Markup.button.callback('💎 Premium Info', 'premium')],
    [Markup.button.callback('Help', 'help')]
  ];
  if (isOwner) buttons.push([Markup.button.callback('Add Premium', 'addprem')]);
  return Markup.inlineKeyboard(buttons.flat());
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

async function sendBannerMenu(ctx, text = '', extraMenu) {
  try {
    await ctx.replyWithPhoto(BANNER_URL, {
      caption: text,
      ...channelButtons()
    });
    await ctx.reply('Choose an option:', extraMenu || mainMenu(isOwner(ctx)));
  } catch {
    await ctx.reply(text, channelButtons());
    await ctx.reply('Choose an option:', extraMenu || mainMenu(isOwner(ctx)));
  }
}

// Unified entry point
bot.start(async (ctx) => {
  await sendBannerMenu(ctx, `👋 Welcome to CYBIX TECH Bot!\nAll features are below.\n`);
});

// /help is only command shown
bot.help(async (ctx) => {
  await sendBannerMenu(ctx, `🚀 CYBIX TECH Bot Help:\nUse the menu below for all actions.\nOnly /start and /help are visible.`);
});

// Unified button handlers
bot.action('signup', async (ctx) => {
  sessions[ctx.from.id] = { action: 'signup', timestamp: Date.now() };
  await sendBannerMenu(ctx, '🔒 Enter your email for sign-up:');
});
bot.action('forgot', async (ctx) => {
  sessions[ctx.from.id] = { action: 'forgot', timestamp: Date.now() };
  await sendBannerMenu(ctx, '🔑 Enter your registered email to reset password:');
});
bot.action('premium', async (ctx) => {
  await sendBannerMenu(ctx, `💎 Premium lets you upload ZIP/files, batch obfuscate/deobfuscate.\nContact @cybixdev to buy premium. Owner will activate for 1 month.`);
});
bot.action('help', async (ctx) => {
  await sendBannerMenu(
    ctx,
    `🚀 CYBIX TECH Bot Help:\n• Sign Up: Get sign-up code\n• Forgot Password: Reset password\n• Premium Info: Info about premium\n• Add Premium: Owner-only\n\nUse the menu below for all actions.`
  );
});
bot.action('addprem', async (ctx) => {
  if (!isOwner(ctx)) return sendBannerMenu(ctx, '❌ Only owner can use this.');
  sessions[ctx.from.id] = { action: 'addprem', timestamp: Date.now() };
  await sendBannerMenu(ctx, 'Enter the email to grant premium access:');
});

// Handle text for all flows
bot.on('text', async (ctx) => {
  const session = sessions[ctx.from.id];
  if (!session || !session.action) {
    // If not in a flow, always show menu
    return sendBannerMenu(
      ctx,
      'Please use the menu below to interact with CYBIX TECH Bot.'
    );
  }
  
  const email = ctx.message.text.trim().toLowerCase();
  // Validate email format
  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return sendBannerMenu(ctx, '❌ Invalid email format. Try again.');
  }
  
  // Add premium (owner only)
  if (session.action === 'addprem' && isOwner(ctx)) {
    try {
      await axios.post(`${API_URL}/admin/add-premium`, { email });
      await sendBannerMenu(ctx, `✅ Premium added for ${email}.`);
    } catch (e) {
      await sendBannerMenu(ctx, '❌ Failed to add premium. Check API or email.');
    }
    delete sessions[ctx.from.id];
    return;
  }
  
  // Signup / forgot flows
  try {
    const res = await axios.post(`${API_URL}/user/check`, { email });
    const exists = res.data.exists;
    
    if (session.action === 'signup') {
      if (exists) return sendBannerMenu(ctx, '❌ Email already exists. Please log in or use Forgot Password.');
      const code = generateCode();
      await axios.post(`${API_URL}/telegram/code`, { email, code, type: 'signup' });
      await sendBannerMenu(
        ctx,
        `✅ Your sign-up code: *${code}* (valid for ${CODE_EXPIRY_MINUTES} minutes)\nPaste this code in the website sign-up form.\n\nGet code again from the menu.`
      );
    } else if (session.action === 'forgot') {
      if (!exists) return sendBannerMenu(ctx, '❌ No account with this email. Try Sign Up.');
      const code = generateCode();
      await axios.post(`${API_URL}/telegram/code`, { email, code, type: 'forgot' });
      await sendBannerMenu(
        ctx,
        `🔑 Password reset code: *${code}* (valid for ${CODE_EXPIRY_MINUTES} minutes)\nEnter it on the website.\n\nGet code again from the menu.`
      );
    }
    delete sessions[ctx.from.id];
  } catch (e) {
    await sendBannerMenu(ctx, '❌ Error connecting to API. Try again later.');
    delete sessions[ctx.from.id];
  }
});

// Owner can use /addprem as a fallback if needed (never shown to users)
bot.command('addprem', async (ctx) => {
  if (!isOwner(ctx)) return sendBannerMenu(ctx, '❌ Only owner can use this.');
  sessions[ctx.from.id] = { action: 'addprem', timestamp: Date.now() };
  await sendBannerMenu(ctx, 'Enter the email to grant premium access:');
});

// Error Handling
bot.catch((err, ctx) => {
  console.error('Bot error', err);
  sendBannerMenu(ctx, '⚠️ An error occurred, please try again.');
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