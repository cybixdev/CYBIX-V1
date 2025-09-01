const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "4kporn",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=4k");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🖼️ 4K Porn",
      reply_markup: getChannelButtons(),
    });
  }
};