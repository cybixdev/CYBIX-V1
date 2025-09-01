const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "hentaiass",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/ass");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🍑 Hentai Ass",
      reply_markup: getChannelButtons(),
    });
  }
};