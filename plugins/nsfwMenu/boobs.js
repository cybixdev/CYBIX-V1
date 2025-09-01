const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "boobs",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=boobs");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🍒 Boobs",
      reply_markup: getChannelButtons(),
    });
  }
};