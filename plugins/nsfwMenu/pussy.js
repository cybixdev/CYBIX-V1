const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "pussy",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=pussy");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "💦 Pussy",
      reply_markup: getChannelButtons(),
    });
  }
};