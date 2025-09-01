const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "lesbian",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=lesbian");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "👩‍❤️‍👩 Lesbian",
      reply_markup: getChannelButtons(),
    });
  }
};