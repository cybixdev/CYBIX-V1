const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "ass",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=ass");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🍑 Sexy Ass",
      reply_markup: getChannelButtons(),
    });
  }
};