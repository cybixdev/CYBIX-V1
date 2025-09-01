const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "megumin",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/megumin");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "💥 Megumin",
      reply_markup: getChannelButtons(),
    });
  }
};