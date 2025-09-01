const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "cumslut",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=cum");
    await bot.sendPhoto(msg.chat.id, res.data.message, {
      caption: "💦 Cumslut (random)",
      reply_markup: getChannelButtons(),
    });
  }
};