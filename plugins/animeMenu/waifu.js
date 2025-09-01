const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "waifu",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://api.waifu.pics/sfw/waifu");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "💮 Waifu",
      reply_markup: getChannelButtons(),
    });
  }
};