const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "anal",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=porn");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🔞 Anal (random)",
      reply_markup: getChannelButtons(),
    });
  }
};