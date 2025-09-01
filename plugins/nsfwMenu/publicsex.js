const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "publicsex",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=porn");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🚦 Public Sex (random)",
      reply_markup: getChannelButtons(),
    });
  }
};