const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "hentairape",
  aliases: [],
  run: async (bot, msg) => {
    // No real rape endpoint: show random hentai
    const res = await axios.get("https://nekos.life/api/v2/img/hentai");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🔞 Hentai (Rape Tag) [Random]",
      reply_markup: getChannelButtons(),
    });
  }
};