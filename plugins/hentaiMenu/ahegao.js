const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "ahegao",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/ahegao");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "😳 Ahegao",
      reply_markup: getChannelButtons(),
    });
  }
};