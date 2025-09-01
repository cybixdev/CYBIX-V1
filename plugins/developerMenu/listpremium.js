const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "listpremium",
  aliases: [],
  developer: true,
  run: async (bot, msg, argText, { listPremium }) => {
    const users = listPremium();
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "⭐ Premium users:\n" + (users.length ? users.join("\n") : "_None_"),
      parse_mode: "Markdown",
      reply_markup: getChannelButtons(),
    });
  }
};