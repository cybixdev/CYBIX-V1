const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "hentaigif",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://nekos.life/api/v2/img/Random_hentai_gif");
    await bot.sendAnimation(msg.chat.id, res.data.url, {
      caption: "🔥 Hentai GIF",
      reply_markup: getChannelButtons(),
    });
  }
};