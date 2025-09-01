const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "hentaipussy",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/pussy");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "💦 Hentai Pussy",
      reply_markup: getChannelButtons(),
    });
  }
};