const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "help",
  aliases: [],
  run: async (bot, msg) => {
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "ℹ️ Use the menus:\n.menu\n.nsfwmenu\n.adultmenu\n.animemenu\n.hentaimenu\n.premium\n\nFor help: @cybixdev",
      reply_markup: getChannelButtons(),
    });
  }
};