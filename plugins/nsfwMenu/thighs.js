const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "thighs",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=thigh");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🦵 Thighs",
      reply_markup: getChannelButtons(),
    });
  }
};