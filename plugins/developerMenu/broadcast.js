const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "broadcast",
  aliases: [],
  developer: true,
  run: async (bot, msg, argText) => {
    if (!argText) {
      await bot.sendPhoto(msg.chat.id, getBanner(), {
        caption: "❌ Send a message to broadcast.",
        reply_markup: getChannelButtons(),
      });
      return;
    }
    const chats = Array.from(new Set([...global.users, ...global.groups]));
    let sent = 0;
    for (const chatId of chats) {
      try {
        await bot.sendMessage(chatId, `🛡️ Broadcast:\n${argText}`);
        sent++;
      } catch {}
    }
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: `✅ Broadcast sent to ${sent} chats.`,
      reply_markup: getChannelButtons(),
    });
  }
};