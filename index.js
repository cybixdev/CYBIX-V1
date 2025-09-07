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

// Session store (for multi-step flows)
const sessions = {}; // user_id: { action, timestamp }

function channelButtons() {
  return Markup.inlineKeyboard([
    [Markup.button.url('WhatsApp Channel', WHATSAPP_CHANNEL)],
    [Markup.button.url('Telegram Channel', TELEGRAM_CHANNEL)],
    [Markup.button.url('CYBIX TECH Website', WEBSITE_LINK)]
  ]);
}

function mainMenuButtons(isOwner = false) {
  const buttons = [
    [Markup.button.callback('Sign Up', 'signup')],
    [Markup.button.callback('Forgot Password', 'forgot')],
    [Markup.button.callback('💎 Premium Info', 'premium')],
    [Markup.button.callback('Users', 'users')],
    [Markup.button.callback('Help', 'help')]
  ];
  if (isOwner) buttons.push([Markup.button.callback('Add Premium', 'addprem')]);
  return Markup.inlineKeyboard(buttons.flat());
}

function isOwner(ctx) {
  return String(ctx.from.id) === String(OWNER_ID);
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function sendBanner(ctx, text, menu = true) {
  try {
    await ctx.replyWithPhoto(BANNER_URL, {
      caption: text,
      ...channelButtons()
    });
    if (menu) {
      await ctx.reply('Menu:', mainMenuButtons(isOwner(ctx)));
    }
  } catch {
    await ctx.reply(text, channelButtons());
    if (menu) {
      await ctx.reply('Menu:', mainMenuButtons(isOwner(ctx)));
    }
  }
}

bot.start(async (ctx) => {
  await sendBanner(ctx, `👋 Welcome to CYBIX TECH Bot!`);
});

bot.help(async (ctx) => {
  await sendBanner(ctx, 'Use the menu below for all actions.');
});

bot.action('signup', async (ctx) => {
  sessions[ctx.from.id] = { action: 'signup', timestamp: Date.now() };
  await sendBanner(ctx, '🔒 Enter your email for sign-up:', false);
});

bot.action('forgot', async (ctx) => {
  sessions[ctx.from.id] = { action: 'forgot', timestamp: Date.now() };
  await sendBanner(ctx, '🔑 Enter your registered email to reset password:', false);
});

bot.action('premium', async (ctx) => {
  await sendBanner(ctx, `💎 Premium lets you upload ZIP/files, batch obfuscate/deobfuscate.\nContact @cybixdev to buy premium. Owner will activate for 1 month.`);
});

bot.action('help', async (ctx) => {
  await sendBanner(
    ctx,
    `Sign Up: Get sign-up code\nForgot Password: Reset password\nPremium Info: Info about premium\nUsers: See registered website users\nAdd Premium: Owner only`
  );
});

bot.action('addprem', async (ctx) => {
  if (!isOwner(ctx)) return sendBanner(ctx, '❌ Only owner can use this.');
  sessions[ctx.from.id] = { action: 'addprem', timestamp: Date.now() };
  await sendBanner(ctx, 'Enter the email to grant premium access:', false);
});

bot.action('users', async (ctx) => {
  try {
    const res = await axios.get(`${API_URL}/user/list`);
    const users = res.data.users;
    if (!users || users.length === 0) {
      await sendBanner(ctx, 'No registered users found.');
    } else {
      let msg = `Registered users:\n`;
      msg += users.map((u, i) => `${i + 1}. ${u.email}${u.premium ? ' (Premium)' : ''}`).join('\n');
      await sendBanner(ctx, msg);
    }
  } catch {
    await sendBanner(ctx, 'Error fetching users.');
  }
});

bot.on('text', async (ctx) => {
  const session = sessions[ctx.from.id];
  if (!session || !session.action) {
    return sendBanner(ctx, 'Please use the menu below.');
  }
  
  const email = ctx.message.text.trim().toLowerCase();
  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return sendBanner(ctx, '❌ Invalid email format. Try again.', false);
  }
  
  if (session.action === 'addprem' && isOwner(ctx)) {
    try {
      await axios.post(`${API_URL}/admin/add-premium`, { email });
      await sendBanner(ctx, `✅ Premium added for ${email}.`);
    } catch {
      await sendBanner(ctx, '❌ Failed to add premium. Check API or email.');
    }
    delete sessions[ctx.from.id];
    return;
  }
  
  try {
    const res = await axios.post(`${API_URL}/user/check`, { email });
    const exists = res.data.exists;
    
    if (session.action === 'signup') {
      if (exists) return sendBanner(ctx, '❌ Email already exists. Please log in or use Forgot Password.', false);
      const code = generateCode();
      await axios.post(`${API_URL}/telegram/code`, { email, code, type: 'signup' });
      await sendBanner(
        ctx,
        `✅ Your sign-up code: *${code}* (valid for ${CODE_EXPIRY_MINUTES} minutes)\nPaste this code in the website sign-up form.`
      );
    } else if (session.action === 'forgot') {
      if (!exists) return sendBanner(ctx, '❌ No account with this email. Try Sign Up.', false);
      const code = generateCode();
      await axios.post(`${API_URL}/telegram/code`, { email, code, type: 'forgot' });
      await sendBanner(
        ctx,
        `🔑 Password reset code: *${code}* (valid for ${CODE_EXPIRY_MINUTES} minutes)\nEnter it on the website.`
      );
    }
    delete sessions[ctx.from.id];
  } catch {
    await sendBanner(ctx, '❌ Error connecting to API. Try again later.');
    delete sessions[ctx.from.id];
  }
});

bot.command('addprem', async (ctx) => {
  if (!isOwner(ctx)) return sendBanner(ctx, '❌ Only owner can use this.');
  sessions[ctx.from.id] = { action: 'addprem', timestamp: Date.now() };
  await sendBanner(ctx, 'Enter the email to grant premium access:', false);
});

bot.command('users', async (ctx) => {
  try {
    const res = await axios.get(`${API_URL}/user/list`);
    const users = res.data.users;
    if (!users || users.length === 0) {
      await sendBanner(ctx, 'No registered users found.');
    } else {
      let msg = `Registered users:\n`;
      msg += users.map((u, i) => `${i + 1}. ${u.email}${u.premium ? ' (Premium)' : ''}`).join('\n');
      await sendBanner(ctx, msg);
    }
  } catch {
    await sendBanner(ctx, 'Error fetching users.');
  }
});

bot.catch((err, ctx) => {
  console.error('Bot error', err);
  sendBanner(ctx, '⚠️ An error occurred, please try again.');
});

if (process.env.PORT) {
  require('http').createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is running');
  }).listen(process.env.PORT);
}

bot.launch();
console.log('CYBIX TECH Telegram Bot running...');