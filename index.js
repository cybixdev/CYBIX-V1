/* -------------- DEPENDENCIES -------------- */
require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
const pino = require('pino');
const { nanoid } = require('nanoid');
const undici = require('undici');
const http = require('http');

/* -------------- ENVIRONMENT -------------- */
const BOT_TOKEN      = process.env.BOT_TOKEN;
const OWNER_ID       = String(process.env.OWNER_ID);
const API_URL        = process.env.API_URL;
const CODE_EXPIRY_MIN = Number(process.env.CODE_EXPIRY_MINUTES) || 3;
const CODE_EXPIRY_MS = CODE_EXPIRY_MIN * 60 * 1000;
const PORT           = process.env.PORT || 3000;
const LOG_LEVEL      = process.env.LOG_LEVEL || 'info';

/* -------------- LOGGER -------------- */
const logger = pino({ level: LOG_LEVEL });

/* -------------- BOT + SESSION -------------- */
const bot = new Telegraf(BOT_TOKEN);
bot.use(Telegraf.session({ defaultSession: () => ({}) }));

/* -------------- RATE LIMIT -------------- */
bot.use(rateLimit({
  window: 10_000,
  limit: 5,
  keyGenerator: ctx => ctx.from.id
}));

/* -------------- CONSTANTS -------------- */
const WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X';
const TELEGRAM_CHANNEL = 'https://t.me/cybixtech';
const WEBSITE_LINK     = 'https://cybixtech.onrender.com';
const BANNER_URL       = 'https://files.catbox.moe/p6f8el.jpg';

/* -------------- HELPERS -------------- */
const isOwner   = ctx => String(ctx.from.id) === OWNER_ID;
const randCode  = () => {
  const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let r = '';
  for (let i = 0; i < 6; i++) r += c[Math.floor(Math.random() * c.length)];
  return r;
};
const channelBtns = () => Markup.inlineKeyboard([
  [Markup.button.url('WhatsApp Channel', WHATSAPP_CHANNEL)],
  [Markup.button.url('Telegram Channel', TELEGRAM_CHANNEL)],
  [Markup.button.url('CYBIX TECH Website', WEBSITE_LINK)]
]);

async function sendBanner(ctx, text) {
  try { await ctx.replyWithPhoto(BANNER_URL, { caption: text, ...channelBtns() }); }
  catch { await ctx.reply(text, channelBtns()); }
}

/* -------------- MENU -------------- */
const mainMenu = () => Markup.inlineKeyboard([
  [Markup.button.callback('📝 Sign-Up', 'act_signup')],
  [Markup.button.callback('🔑 Forgot Password', 'act_forgot')],
  [Markup.button.callback('💎 Premium Info', 'act_premium')],
  [Markup.button.callback('❓ Help', 'act_help')]
]);

/* -------------- FLOW CLEANER -------------- */
setInterval(() => {
  const now = Date.now();
  bot.session?.store?.forEach?.((s, k) => {
    if (s.flow?.ts && now - s.flow.ts > CODE_EXPIRY_MS) delete s.flow;
  });
}, 60_000);

/* -------------- START -------------- */
bot.start(async ctx => {
  delete ctx.session.flow;
  await sendBanner(ctx, '👋 Welcome to CYBIX TECH Bot!\nChoose an option below:');
  return ctx.reply('Main menu:', mainMenu());
});

/* -------------- ACTIONS -------------- */
bot.action('act_signup', async ctx => {
  ctx.session.flow = { type: 'signup', ts: Date.now() };
  await ctx.answerCbQuery();
  await ctx.reply('🔒 Enter your email for sign-up:', Markup.inlineKeyboard([
    [Markup.button.callback('❌ Cancel', 'act_cancel')]
  ]));
});

bot.action('act_forgot', async ctx => {
  ctx.session.flow = { type: 'forgot', ts: Date.now() };
  await ctx.answerCbQuery();
  await ctx.reply('🔑 Enter your registered email to reset password:', Markup.inlineKeyboard([
    [Markup.button.callback('❌ Cancel', 'act_cancel')]
  ]));
});

bot.action('act_premium', async ctx => {
  await ctx.answerCbQuery();
  await sendBanner(ctx, '💎 Premium lets you upload ZIP / batch obfuscate.\nContact @cybixdev to buy.');
});

bot.action('act_help', async ctx => {
  await ctx.answerCbQuery();
  await ctx.reply('🚀 Sign-Up • Forgot Password • Premium info\nPress /start to return to menu.');
});

bot.action('act_cancel', async ctx => {
  delete ctx.session.flow;
  await ctx.answerCbQuery('Cancelled');
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
});

/* -------------- TEXT HANDLER -------------- */
bot.on('text', async ctx => {
  const flow = ctx.session.flow;
  if (!flow) return;

  const email = ctx.message.text.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return ctx.reply('❌ Invalid email format. Try again.');

  try {
    const { body } = await undici.request(`${API_URL}/user/check`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const { exists } = await body.json();

    if (flow.type === 'signup' && exists) return ctx.reply('❌ Email already exists. Use /forgot or login.');
    if (flow.type === 'forgot' && !exists) return ctx.reply('❌ No account with this email. Try /signup.');

    const code = randCode();
    await undici.request(`${API_URL}/telegram/code`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, code, type: flow.type })
    });

    await ctx.reply(`✅ Your code: \`${code}\` (valid ${CODE_EXPIRY_MIN} min)\nPaste it on the website.`, { parse_mode: 'Markdown' });
    await sendBanner(ctx, 'Need help? Join our channels:');
  } catch (e) {
    logger.error(e);
    await ctx.reply('❌ Error contacting API. Try again later.');
  } finally {
    delete ctx.session.flow;
  }
});

/* -------------- OWNER COMMANDS -------------- */
bot.command('addprem', async ctx => {
  if (!isOwner(ctx)) return ctx.reply('❌ Owner only.');
  const email = ctx.message.text.split(' ')[1]?.trim().toLowerCase();
  if (!email) return ctx.reply('Usage: /addprem <email>');
  try {
    await undici.request(`${API_URL}/admin/add-premium`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email })
    });
    await ctx.reply(`✅ Premium added for ${email}.`);
  } catch { await ctx.reply('❌ Failed to add premium.'); }
});

bot.command('gencoupon', async ctx => {
  if (!isOwner(ctx)) return ctx.reply('❌ Owner only.');
  const days = Number(ctx.message.text.split(' ')[1]) || 7;
  const coupon = nanoid(8).toUpperCase();
  // TODO: store coupon in DB / redis
  await ctx.reply(`🎟 Coupon \`${coupon}\` (${days}d) created.`, { parse_mode: 'Markdown' });
});

/* -------------- ERROR ---------- */
bot.catch((err, ctx) => {
  logger.error({ err, user: ctx.from?.id }, 'Bot error');
  ctx.reply('⚠️ An error occurred, please try again.');
});

/* -------------- LAUNCH -------------- */
bot.launch();
logger.info('CYBIX TECH Telegram Bot running…');

/* -------------- HEALTH -------------- */
http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
  } else {
    res.writeHead(404).end();
  }
}).listen(PORT);
