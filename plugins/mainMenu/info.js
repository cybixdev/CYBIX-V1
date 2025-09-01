const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "info",
  aliases: [],
  run: async (bot, msg) => {
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🤖 CYBIX V3 Telegram Bot\nBy @cybixdev\nPowered by CYBIX TECH",
      reply_markup: getChannelButtons(),
    });
  }
};