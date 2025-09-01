const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "buybot",
  aliases: [],
  run: async (bot, msg) => {
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "💸 Want to buy the bot? Contact @cybixdev",
      reply_markup: getChannelButtons(),
    });
  }
};