const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");l
module.exports = {
  command: "xvideos",
  aliases: [],
  run: async (bot, msg) => {
    // No official API, using random porn gif
    const res = await axios.get("https://nekobot.xyz/api/image?type=pgif");
    await bot.sendAnimation(msg.chat.id, res.data.message, {
      caption: "🔞 XVideos (random)",
      reply_markup: getChannelButtons(),
    });
  }
};