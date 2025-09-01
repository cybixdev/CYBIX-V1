const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "anime",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://api.waifu.pics/sfw/waifu");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "✨ Random Anime Waifu",
      reply_markup: getChannelButtons(),
    });
  }
};