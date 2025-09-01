const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "animewall",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/wallpaper");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🖼️ Anime Wallpaper",
      reply_markup: getChannelButtons(),
    });
  }
};