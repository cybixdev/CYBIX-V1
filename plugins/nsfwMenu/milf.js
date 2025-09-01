const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "milf",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=milf");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "👩 MILF",
      reply_markup: getChannelButtons(),
    });
  }
};