const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "removepremium",
  aliases: [],
  developer: true,
  run: async (bot, msg, argText, { removePremium }) => {
    const id = Number(argText.trim());
    if (!id) {
      await bot.sendPhoto(msg.chat.id, getBanner(), {
        caption: "❌ Send a valid Telegram user ID.",
        reply_markup: getChannelButtons(),
      });
      return;
    }
    removePremium(id);
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: `✅ Removed user ${id} from premium.`,
      reply_markup: getChannelButtons(),
    });
  }
};