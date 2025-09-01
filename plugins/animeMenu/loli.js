const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "loli",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/loli");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🌸 Loli",
      reply_markup: getChannelButtons(),
    });
  }
};