const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.redgifs(?:\s+(.+))?$/i, async ctx => {
    const query = ctx.match[1] || "porn";
    try {
      const url = `https://api.lolhuman.xyz/api/redgifs?apikey=demo&query=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);
      if (data.result && data.result.url) {
        await ctx.replyWithAnimation(data.result.url, {
          caption: `🔞 *Redgifs*\n${query}`,
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else {
        await ctx.replyWithPhoto(BANNER, {
          caption: "❌ No Redgifs found.",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      }
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ Redgifs API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};