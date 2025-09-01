const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "hentaicream",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/cum");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🍶 Hentai Cream Pie",
      reply_markup: getChannelButtons(),
    });
  }
};