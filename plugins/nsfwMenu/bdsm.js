const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "bdsm",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=bdsm");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "🔗 BDSM",
      reply_markup: getChannelButtons(),
    });
  }
};