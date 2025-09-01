const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "animesmile",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://api.waifu.pics/sfw/smile");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "😊 Anime Smile",
      reply_markup: getChannelButtons(),
    });
  }
};