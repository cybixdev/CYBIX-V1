const axios = require("axios");
const { getChannelButtons } = require("../../utils/buttons");
const { getBanner } = require("../../utils/banner");
module.exports = {
  command: "sexstory",
  aliases: [],
  run: async (bot, msg) => {
    // Using a public gist of erotic stories for demo purposes:
    const res = await axios.get("https://raw.githubusercontent.com/eriknguyen/sexstories/main/sexstories.json");
    const stories = res.data;
    const story = stories[Math.floor(Math.random() * stories.length)];
    await bot.sendPhoto(msg.chat.id, getBanner(), {
      caption: `📝 Sex Story:\n\n${story}`,
      reply_markup: getChannelButtons(),
    });
  }
};