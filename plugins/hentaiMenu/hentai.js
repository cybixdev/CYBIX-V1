const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "hentai",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/hentai");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🍥 Hentai Image",
      reply_markup: getChannelButtons(),
    });
  }
};