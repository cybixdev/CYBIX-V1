const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "trap",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/trap");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🍑 Trap Hentai",
      reply_markup: getChannelButtons(),
    });
  }
};