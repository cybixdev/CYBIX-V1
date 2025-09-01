const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.pornhub(?:\s+(.+))?$/i, async ctx => {
    const query = ctx.match[1];
    if (!query) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.pornhub search terms` (e.g. .pornhub milf)",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      const url = `https://api.lolhuman.xyz/api/pornhubsearch?apikey=demo&query=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);
      if (data.result && data.result.length > 0) {
        const vid = data.result[0];
        await ctx.replyWithPhoto(vid.thumbnail, {
          caption: `🔞 *Pornhub*\nTitle: ${vid.title}\nDuration: ${vid.duration}\n${vid.link}`,
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else {
        await ctx.replyWithPhoto(BANNER, {
          caption: "❌ No Pornhub results.",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      }
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Pornhub API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};