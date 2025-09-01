const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "hentaivid",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://api.waifu.pics/nsfw/waifu");
    await bot.sendVideo(msg.chat.id, res.data.url, {
      caption: "🎥 Hentai Video",
      reply_markup: getChannelButtons(),
    });
  }
};