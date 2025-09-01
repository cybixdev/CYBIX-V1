const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "xnxx",
  aliases: [],
  run: async (bot, msg) => {
    // No official API, using random porn gif
    const res = await axios.get("https://nekobot.xyz/api/image?type=pgif");
    await bot.sendAnimation(msg.chat.id, res.data.message, {
      caption: "🔞 XNXX (random)",
      reply_markup: getChannelButtons(),
    });
  }
};