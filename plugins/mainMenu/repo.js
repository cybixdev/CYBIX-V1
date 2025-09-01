const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "repo",
  aliases: [],
  run: async (bot, msg) => {
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🔗 Bot Repository:\CONTACT OWNER",
      reply_markup: getChannelButtons(),
    });
  }
};