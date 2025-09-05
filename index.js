require('dotenv').config();
const { Telegraf } = require('telegraf');
const {
  initConfig, getPrefix, setPrefix, getBanner, setBanner, getBotName, setBotName
} = require('./config');
const { loadPlugins } = require('./plugins/index');

const BOT_TOKEN = process.env.TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN || !OWNER_ID) {
  console.error('Missing TOKEN or OWNER_ID in environment!');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

const menuTemplate = `
╭━───〔 𝐂𝐘𝐁𝐈𝐗 𝐕1 〕───━━╮
│ ✦ ᴘʀᴇғɪx : {prefix}
│ ✦ ᴏᴡɴᴇʀ : {owner}
│ ✦ ᴜsᴇʀ : {user}
│ ✦ ᴜsᴇʀ ɪᴅ : {userid}
│ ✦ ᴜsᴇʀs : {users}
│ ✦ sᴘᴇᴇᴅ : {speed}
│ ✦ sᴛᴀᴛᴜs : {status}
│ ✦ ᴘʟᴜɢɪɴs : {plugins}
│ ✦ ᴠᴇʀsɪᴏɴ : {version}
│ ✦ ᴛɪᴍᴇ ɴᴏᴡ : {timeNow}
│ ✦ ᴅᴀᴛᴇ ɴᴏᴡ : {dateNow}
│ ✦ ᴍᴇᴍᴏʀʏ : {memory}
╰───────────────────╯
╭━━【 𝐀𝐈 𝐌𝐄𝐍𝐔 】━━
┃ • ᴄʜᴀᴛɢᴘᴛ
┃ • ᴏᴘᴇɴᴀɪ
┃ • ʙʟᴀᴄᴋʙᴏx
┃ • ɢᴇᴍɪɴɪ
┃ • ᴅᴇᴇᴘsᴇᴇᴋ
┃ • ᴛᴇxᴛ2ɪᴍɢ
╰━━━━━━━━━━━━━━━
╭━━【 𝐃𝐋 𝐌𝐄𝐍𝐔 】━━
┃ • ᴀᴘᴋ
┃ • sᴘᴏᴛɪғʏ
┃ • ɢɪᴛᴄʟᴏɴᴇ
┃ • ᴍᴇᴅɪᴀғɪʀᴇ
┃ • ᴘʟᴀʏ
┃ • ɢᴅʀɪᴠᴇ 
╰━━━━━━━━━━━━━━━
╭━━【 𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔 】━━
┃ • ʀᴇᴘᴏ
┃ • ᴘɪɴɢ
┃ • ʀᴜɴᴛɪᴍᴇ
╰━━━━━━━━━━━━━━━
╭━━【 𝐀𝐃𝐔𝐋𝐓 𝐌𝐄𝐍𝐔 】━━
┃ • xᴠɪᴅᴇᴏsᴇᴀʀᴄʜ
┃ • xɴxxsᴇᴀʀᴄʜ
┃ • ᴅʟ-xɴxxᴠɪᴅ
┃ • ᴅʟ-xᴠɪᴅᴇᴏ
╰━━━━━━━━━━━━━━━
╭━━【𝐃𝐄𝐕 𝐌𝐄𝐍𝐔】━━
┃ • sᴛᴀᴛɪᴄs
┃ • ʟɪsᴛᴜsᴇʀs
┃ • ʟᴏɢs
┃ • sᴇᴛʙᴀɴɴᴇʀ
┃ • sᴇᴛᴘʀᴇғɪx
┃ • sᴇᴛʙᴏᴛɴᴀᴍᴇ
╰━━━━━━━━━━━━━━━

ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐂𝐘𝐁𝐈𝐗 𝐃𝐄𝐕𝐒
`;

async function buildMenuCaption(ctx) {
  const prefix = (await getPrefix()).join(' ');
  const owner = OWNER_ID;
  const user = ctx.from?.username || ctx.from?.first_name || 'Unknown';
  const userid = ctx.from?.id || 'Unknown';
  let users = 1;
  try {
    if (ctx.chat?.id) users = await bot.telegram.getChatMembersCount(ctx.chat.id);
  } catch { users = 1; }
  const speed = `${Math.floor(Math.random() * 100)}ms`;
  const status = 'Online';
  const plugins = 0; // Plugins will be loaded later
  const version = require('./package.json').version;
  const now = new Date();
  const timeNow = now.toLocaleTimeString();
  const dateNow = now.toLocaleDateString();
  const memory = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;

  return menuTemplate
    .replace('{prefix}', prefix)
    .replace('{owner}', owner)
    .replace('{user}', user)
    .replace('{userid}', userid)
    .replace('{users}', users)
    .replace('{speed}', speed)
    .replace('{status}', status)
    .replace('{plugins}', plugins)
    .replace('{version}', version)
    .replace('{timeNow}', timeNow)
    .replace('{dateNow}', dateNow)
    .replace('{memory}', memory);
}

(async () => {
  await initConfig();

  async function sendBannerMenu(ctx, caption = null) {
    const banner = await getBanner();
    await ctx.replyWithPhoto(
      banner,
      {
        caption: caption || await buildMenuCaption(ctx),
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Telegram Channel", url: "https://t.me/cybixtech" },
              { text: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X" }
            ]
          ]
        }
      }
    );
  }

  // Menu commands
  const menuCmds = ['menu', 'start', 'bot'];
  bot.command(menuCmds, async ctx => sendBannerMenu(ctx));
  bot.hears(new RegExp(`^(${(await getPrefix()).join('|')})(menu|start|bot)$`, 'i'), async ctx => sendBannerMenu(ctx));

  // Owner-only prefix setter
  bot.command('setprefix', async ctx => {
    if (String(ctx.from.id) !== String(OWNER_ID)) return ctx.reply('Only the owner can change the prefix.');
    const args = ctx.message.text.split(' ').slice(1);
    if (!args.length) return ctx.reply('Usage: setprefix <newPrefix1> <newPrefix2> ...');
    await setPrefix(args);
    await ctx.reply(`Prefix updated to: ${args.join(', ')}`);
  });

  // Owner-only bot name setter
  bot.command('setbotname', async ctx => {
    if (String(ctx.from.id) !== String(OWNER_ID)) return ctx.reply('Only the owner can change the bot name.');
    const args = ctx.message.text.split(' ').slice(1);
    if (!args.length) return ctx.reply('Usage: setbotname <newBotName>');
    await setBotName(args.join(' '));
    await ctx.reply(`Bot name updated to: ${args.join(' ')}`);
  });

  // Owner-only banner setter
  bot.command('setbanner', async ctx => {
    if (String(ctx.from.id) !== String(OWNER_ID)) return ctx.reply('Only the owner can change the banner.');
    const args = ctx.message.text.split(' ').slice(1);
    if (!args.length) return ctx.reply('Usage: setbanner <bannerUrl>');
    await setBanner(args.join(' '));
    await ctx.reply('Banner updated!');
  });

  // Example ping command
  bot.command('ping', async ctx => {
    const start = Date.now();
    await ctx.reply('Pong!');
    const elapsed = Date.now() - start;
    await sendBannerMenu(ctx, `Ping: ${elapsed}ms`);
  });

  // Always reply with banner & buttons for any message not already handled
  bot.on('text', async (ctx, next) => {
    if (ctx.update.message.text.startsWith('/') || ctx.update.message.text.startsWith('.')) return next();
    await sendBannerMenu(ctx, 'How can I assist you?');
  });

  // Plugin loader (will be used when plugins are added)
  loadPlugins(bot, {
    getBanner,
    setBanner,
    getPrefix,
    setPrefix,
    getBotName,
    setBotName
  });

  bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('Oops! Something went wrong.').catch(() => {});
  });

  bot.launch({
    webhook: { port: PORT }
  });
  console.log(`CYBIX Bot running on port ${PORT}`);

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
})();