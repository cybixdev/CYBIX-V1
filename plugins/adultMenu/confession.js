const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "confession",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://api.truthordarebot.xyz/v1/confession");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: `🙊 Confession:\n\n${res.data.question}`,
      reply_markup: getChannelButtons(),
    });
  }
};