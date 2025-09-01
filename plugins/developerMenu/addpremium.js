const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "addpremium",
  aliases: [],
  developer: true,
  run: async (bot, msg, argText, { addPremium }) => {
    const id = Number(argText.trim());
    if (!id) {
      await bot.sendPhoto(msg.chat.id, getBanner(), {
        caption: "❌ Send a valid Telegram user ID.",
        reply_markup: getChannelButtons(),
      });
      return;
    }
    addPremium(id);
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: `✅ Added user ${id} as premium.`,
      reply_markup: getChannelButtons(),
    });
  }
};