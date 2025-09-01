const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "blowjob",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekobot.xyz/api/image?type=blowjob");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: "👄 Blowjob",
      reply_markup: getChannelButtons(),
    });
  }
};