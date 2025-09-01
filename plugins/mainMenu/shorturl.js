const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "shorturl",
  aliases: [],
  run: async (bot, msg, argText) => {
    try {
      const url = argText.trim();
      if (!url.startsWith("http")) throw "";
      const { data } = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
      await bot.sendPhoto(msg.chat.id, getBanner(), {
        caption: `🔗 Short URL: ${data}`,
        reply_markup: getChannelButtons(),
      });
    } catch {
      await bot.sendPhoto(msg.chat.id, getBanner(), {
        caption: "❌ Send a valid URL: `.shorturl https://...`",
        reply_markup: getChannelButtons(),
      });
    }
  }
};