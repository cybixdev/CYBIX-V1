const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "runtime",
  aliases: [],
  run: async (bot, msg) => {
    const uptime = process.uptime();
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: `⏱️ *Bot Uptime*: ${Math.floor(uptime/60)}m ${Math.floor(uptime%60)}s`,
      parse_mode: "Markdown",
      reply_markup: getChannelButtons(),
    });
  }
};