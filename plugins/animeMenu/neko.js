const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "neko",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/neko");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🐱 Neko",
      reply_markup: getChannelButtons(),
    });
  }
};