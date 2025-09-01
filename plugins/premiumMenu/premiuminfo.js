const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "premiuminfo",
  aliases: [],
  premium: true,
  run: async (bot, msg) => {
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "⭐ Premium gives you access to Veo3, CCGen, and more. Contact @cybixdev to upgrade!",
      reply_markup: getChannelButtons(),
    });
  }
};