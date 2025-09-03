const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");

// ==== CONFIG ====
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = process.env.OWNER_ID || "I-am-nigro"; // Set in env
const VERSION = "1.0.0";
const BANNER_URL = process.env.BANNER_URL || "https://i.imgur.com/A9QR3G5.png";
const TIMEZONE = "Africa/Harare";

// ==== PLUGIN LOADER ====
function loadPlugins() {
    const plugins = {};
    const pluginDirs = ["dlMenu", "pornMenu", "nsfwMenu", "aiMenu"];
    let count = 0;
    for (const dir of pluginDirs) {
        const dirPath = path.join(__dirname, "plugins", dir);
        if (!fs.existsSync(dirPath)) continue;
        for (const file of fs.readdirSync(dirPath)) {
            if (!file.endsWith(".js")) continue;
            const cmdName = file.replace(".js", "");
            plugins[cmdName] = require(path.join(dirPath, file));
            count++;
        }
    }
    return { plugins, count };
}
const { plugins, count: pluginCount } = loadPlugins();

// ==== UTILS ====
function getUptime() {
    const sec = process.uptime();
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${h}h ${m}m ${s}s`;
}
function getRam() {
    const total = os.totalmem() / (1024 * 1024);
    const free = os.freemem() / (1024 * 1024);
    return `${free.toFixed(0)}/${total.toFixed(0)} MB Free`;
}
function harareTimeDate() {
    const now = new Date();
    const harare = new Date(now.toLocaleString("en-US", { timeZone: TIMEZONE }));
    return {
        time: harare.toTimeString().slice(0, 8),
        date: harare.toISOString().slice(0, 10)
    };
}

// ==== BOT ====
const bot = new Telegraf(BOT_TOKEN);

// ==== MENU HEADER ====
function menuHeader(ctx) {
    const { time, date } = harareTimeDate();
    const userName = ctx.from.first_name || "User";
    const userId = ctx.from.id;
    return (
        "╭━━〔 CYBIX-V1 MENU 〕━━╮\n" +
        `│ ✦ Prefix : [ . ] or [ / ]\n` +
        `│ ✦ Owner : ${OWNER_ID}\n` +
        `│ ✦ User : ${userName} (${userId})\n` +
        `│ ✦ Plugins Loaded : ${pluginCount}\n` +
        `│ ✦ Version : ${VERSION}\n` +
        `│ ✦ Uptime : ${getUptime()}\n` +
        `│ ✦ Time Now : ${time}\n` +
        `│ ✦ Date Today : ${date}\n` +
        `│ ✦ Time Zone : ${TIMEZONE}\n` +
        `│ ✦ Server RAM : ${getRam()}\n` +
        "╰───────────────────╯\n"
    );
}

// ==== MENU BODY ====
function menuBody() {
    return (
        "╭━✦❮ DOWNLOAD MENU ❯✦━⊷\n" +
        "┃ play\n" +
        "┃ songinfo\n" +
        "┃ lyrics\n" +
        "┃ apk\n" +
        "┃ image\n" +
        "┃ video\n" +
        "╰━━━━━━━━━━━━━━━━━⊷\n\n" +
        "╭━✦❮ PORN MENU ❯✦━⊷\n" +
        "┃ porn\n" +
        "┃ xvideos\n" +
        "┃ redtube\n" +
        "┃ porngif\n" +
        "┃ lesbian\n" +
        "┃ gayporn\n" +
        "╰━━━━━━━━━━━━━━━━━⊷\n\n" +
        "╭━✦❮ NSFW MENU ❯✦━⊷\n" +
        "┃ hentai\n" +
        "┃ boobs\n" +
        "┃ nsfwgif\n" +
        "┃ anal\n" +
        "┃ pussy\n" +
        "┃ cum\n" +
        "╰━━━━━━━━━━━━━━━━━⊷\n\n" +
        "╭━✦❮ AI MENU ❯✦━⊷\n" +
        "┃ chatgpt\n" +
        "┃ gemini\n" +
        "┃ llama\n" +
        "┃ imggen\n" +
        "┃ blackbox\n" +
        "╰━━━━━━━━━━━━━━━━━⊷"
    );
}

// ==== /start & /menu ====
function channelButtons() {
    return Markup.inlineKeyboard([
        [Markup.button.url("📲 WhatsApp Channel", process.env.WHATSAPP_CHANNEL || "https://chat.whatsapp.com/EXAMPLE")],
        [Markup.button.url("📢 Telegram Channel", process.env.TELEGRAM_CHANNEL || "https://t.me/example_channel")]
    ]);
}
async function sendBanner(ctx) {
    await ctx.replyWithPhoto({ url: BANNER_URL }, { caption: "🎵 Powered by CYBIX-V1" });
}
bot.start(async (ctx) => {
    await sendBanner(ctx);
    await ctx.reply(menuHeader(ctx) + "\n" + menuBody(), channelButtons());
});
bot.command("menu", async (ctx) => {
    await sendBanner(ctx);
    await ctx.reply(menuHeader(ctx) + "\n" + menuBody(), channelButtons());
});

// ==== PLUGIN COMMAND HANDLER ====
for (const cmd in plugins) {
    bot.command(cmd, async (ctx) => {
        await sendBanner(ctx);
        try {
            await plugins[cmd].run(ctx);
        } catch (err) {
            console.error(err);
            await ctx.reply("❌ Error. Please try again.");
        }
    });
}

// ==== FALLBACK ====
bot.on("message", async (ctx) => {
    await ctx.reply("❗ Unknown command. Type /menu for help.");
});

// ==== NORMAL BOT LAUNCH ====
bot.launch();
console.log("CYBIX-V1 Bot running..."); 