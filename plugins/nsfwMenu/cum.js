const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "cum",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=cum");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "💦 Cum",
      reply_markup: getChannelButtons(),
    });
  }
};