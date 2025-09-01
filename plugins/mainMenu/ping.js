const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "ping",
  aliases: [],
  run: async (bot, msg) => {
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: `🏓 *Pong!* Latency: ${Date.now() - msg.date * 1000}ms`,
      parse_mode: "Markdown",
      reply_markup: getChannelButtons(),
    });
  }
};