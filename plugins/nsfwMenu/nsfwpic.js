const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "nsfwpic",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=porn");
    await bot.sendPhoto(msg.chat.id, res.data.message, {
      caption: "🍑 NSFW Porn Image",
      reply_markup: getChannelButtons(),
    });
  }
};