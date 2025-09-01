const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "developer",
  aliases: [],
  run: async (bot, msg) => {
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "👾 Developer: @cybixdev\nTelegram: https://t.me/cybixdev",
      reply_markup: getChannelButtons(),
    });
  }
};