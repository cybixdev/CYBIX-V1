const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "ccgen",
  aliases: ["cc"],
  premium: true,
  run: async (bot, msg, argText) => {
    try {
      const bin = argText || "411111";
      const res = await axios.get(`https://cc-gen.net/api/ccgen?bin=${bin}&amount=3`);
      if (res.data && Array.isArray(res.data.cards)) {
        await bot.sendPhoto(msg.chat.id, getBanner(), {
          caption: "💳 *Credit Cards:*\n" + res.data.cards.join("\n"),
          parse_mode: "Markdown",
          reply_markup: getChannelButtons(),
        });
      } else {
        await bot.sendPhoto(msg.chat.id, getBanner(), {
          caption: "❌ Failed to generate credit cards.",
          reply_markup: getChannelButtons(),
        });
      }
    } catch {
      await bot.sendPhoto(msg.chat.id, getBanner(), {
        caption: "❌ Credit card generation error.",
        reply_markup: getChannelButtons(),
      });
    }
  }
};