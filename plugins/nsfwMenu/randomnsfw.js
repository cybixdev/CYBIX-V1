const axios = require("axios");
const types = [
  "anal", "ass", "bdsm", "blowjob", "boobs", "cum", "cumslut", "dick",
  "facesitting", "hentai", "lesbian", "milf", "nsfw", "public", "pussy", "spank", "thigh", "4k"
];
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.randomnsfw$/i, async ctx => {
    try {
      const type = types[Math.floor(Math.random() * types.length)];
      const res = await axios.get(`https://nekobot.xyz/api/image?type=${type}`);
      await ctx.replyWithPhoto(res.data.message, {
        caption: `🔞 Random NSFW (${type})`,
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ RandomNSFW API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};