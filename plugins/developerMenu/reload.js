const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "reload",
  aliases: [],
  developer: true,
  run: async (bot, msg) => {
    // No real reload in single-process bots; for PM2/forever only
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🔄 Reload not implemented (restart the bot process).",
      reply_markup: getChannelButtons(),
    });
  }
};