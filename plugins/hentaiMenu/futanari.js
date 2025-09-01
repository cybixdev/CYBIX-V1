const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "futanari",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/futanari");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "👀 Futanari",
      reply_markup: getChannelButtons(),
    });
  }
};