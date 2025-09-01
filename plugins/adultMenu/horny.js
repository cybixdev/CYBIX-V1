const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "horny",
  aliases: [],
  run: async (bot, msg) => {
    // No horny API, using random porn gif
    const res = await axios.get("https://nekobot.xyz/api/image?type=pgif");
    await bot.sendAnimation(msg.chat.id, res.data.message, {
      caption: "🔞 Horny (random)",
      reply_markup: getChannelButtons(),
    });
  }
};