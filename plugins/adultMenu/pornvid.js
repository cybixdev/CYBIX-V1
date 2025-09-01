const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "pornvid",
  aliases: [],
  run: async (bot, msg) => {
    // Using waifu.pics nsfw video as a random video
    const res = await axios.get("https://api.waifu.pics/nsfw/waifu");
    await bot.sendVideo(msg.chat.id, res.data.url, {
      caption: "🎥 Porn Video (random)",
      reply_markup: getChannelButtons(),
    });
  }
};