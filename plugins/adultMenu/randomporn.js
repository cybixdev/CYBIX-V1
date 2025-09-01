const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "randomporn",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=pgif");
    await bot.sendAnimation(msg.chat.id, res.data.message, {
      caption: "🔞 Random Porn",
      reply_markup: getChannelButtons(),
    });
  }
};