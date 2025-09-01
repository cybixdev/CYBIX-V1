const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "shinobu",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/shinobu");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🍬 Shinobu",
      reply_markup: getChannelButtons(),
    });
  }
};