const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
module.exports = {
  command: "animequote",
  aliases: [],
  run: async (bot, msg) => {
    const res = await axios.get("https://animechan.xyz/api/random");
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: `❝ ${res.data.quote} ❞\n— *${res.data.character}* (${res.data.anime})`,
      parse_mode: "Markdown",
      reply_markup: getChannelButtons(),
    });
  }
};