const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "currency",
  aliases: [],
  run: async (bot, msg, argText) => {
    try {
      const base = argText.split(" ")[0] || "USD";
      const { data } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`);
      await bot.sendPhoto(msg.chat.id, getBanner(), {
        caption: `💱 1 ${base.toUpperCase()}:\nEUR: ${data.rates.EUR}\nNGN: ${data.rates.NGN}\nGBP: ${data.rates.GBP}`,
        reply_markup: getChannelButtons(),
      });
    } catch {
      await bot.sendPhoto(msg.chat.id, getBanner(), {
        caption: "❌ Failed to fetch currency data.",
        reply_markup: getChannelButtons(),
      });
    }
  }
};