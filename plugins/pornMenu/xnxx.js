const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.xnxx(?:\s+(.+))?$/i, async ctx => {
    const query = ctx.match[1];
    if (!query) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.xnxx search terms` (e.g. .xnxx lesbian)",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      const url = `https://api.lolhuman.xyz/api/xnxxsearch?apikey=demo&query=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);
      if (data.result && data.result.length > 0) {
        const vid = data.result[0];
        await ctx.replyWithPhoto(vid.thumbnail, {
          caption: `🔞 *XNXX*\nTitle: ${vid.title}\nDuration: ${vid.duration}\n${vid.link}`,
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else {
        await ctx.replyWithPhoto(BANNER, {
          caption: "❌ No XNXX results.",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      }
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ XNXX API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};