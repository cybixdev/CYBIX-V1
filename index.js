require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
const { getBanner } = require("./utils/banner");
const { getChannelButtons } = require("./utils/buttons");
const { isPremium, addPremium, removePremium, listPremium } = require("./utils/premium");
const config = require("./config");

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN missing in .env");

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

global.users = new Set();
global.groups = new Set();

bot.on("message", (msg) => {
  if (msg.chat.type === "private") global.users.add(msg.chat.id);
  if (["group", "supergroup"].includes(msg.chat.type)) global.groups.add(msg.chat.id);
});

function buildMenuCaption(ctx) {
  return `╭━━━━【 CYBIX V3 】━━━━
┃ @${ctx.from.username || ctx.from.first_name}
┣━ users: ${global.users.size}
┣━ groups: ${global.groups.size}
┣━ prefix: "."
┣━ owner: ${config.developer}
╰━━━━━━━━━━━━━━━━━━━━━`;
}

// Load plugins recursively
function loadPlugins(dir, plugins = {}) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) loadPlugins(fullPath, plugins);
    else if (file.endsWith(".js")) {
      const plugin = require("./" + fullPath.replace(/\\/g, "/"));
      if (plugin.command) plugins[plugin.command] = plugin;
      if (plugin.aliases && Array.isArray(plugin.aliases)) {
        for (const alias of plugin.aliases) plugins[alias] = plugin;
      }
    }
  });
  return plugins;
}
const plugins = loadPlugins("plugins");

const menuCaptions = require("./config").menus;
const allMenus = {
  ".menu": "main",
  ".nsfwmenu": "nsfw",
  ".adultmenu": "adult",
  ".animemenu": "anime",
  ".hentaimenu": "hentai",
  ".premium": "premium",
  ".devmenu": "developer"
};

Object.entries(allMenus).forEach(([cmd, key]) => {
  bot.onText(new RegExp(`^\\${cmd}`, "i"), async (msg) => {
    const bannerUrl = getBanner();
    const buttons = getChannelButtons();
    const menuCaption =
      buildMenuCaption(msg) + "\n" + menuCaptions[key] + "\n\n▣ powered by *CYBIX TECH* 👹💀";
    await bot.sendPhoto(msg.chat.id, bannerUrl, {
      caption: menuCaption,
      parse_mode: "Markdown",
      reply_markup: buttons,
    });
  });
});

bot.on("message", async (msg) => {
  if (!msg.text || !msg.text.startsWith(".")) return;
  
  const [cmd, ...args] = msg.text.slice(1).split(" ");
  const argText = args.join(" ");
  const plugin = plugins[cmd.toLowerCase()];
  const bannerUrl = getBanner();
  const buttons = getChannelButtons();
  
  if (allMenus["." + cmd.toLowerCase()]) return;
  
  if (plugin) {
    if (plugin.premium && !isPremium(msg.from.id) && msg.from.id != config.ownerId) {
      await bot.sendPhoto(msg.chat.id, bannerUrl, {
        caption: "🔒 This command is for premium users. Type `.premium` to see how to upgrade.",
        reply_markup: buttons,
      });
      return;
    }
    if (plugin.developer && msg.from.id != config.ownerId) {
      await bot.sendPhoto(msg.chat.id, bannerUrl, {
        caption: "🔒 This command is for the developer only.",
        reply_markup: buttons,
      });
      return;
    }
    
    try {
      await bot.sendPhoto(msg.chat.id, bannerUrl, {
        caption: buildMenuCaption(msg),
        reply_markup: buttons,
      });
      await plugin.run(bot, msg, argText, { config, isPremium, addPremium, removePremium, listPremium, bot });
    } catch (err) {
      // Only log error, never send to user
      console.error(err);
    }
  }
});

module.exports = bot;