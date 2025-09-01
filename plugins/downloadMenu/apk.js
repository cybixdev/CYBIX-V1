const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.apk(?:\s+(.+))?$/i, async ctx => {
    const q = ctx.match[1];
    if (!q) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.apk whatsapp` (search for any APK)",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      const url = `https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(q)}`;
      const { data } = await axios.get(url);
      if (data && data.result && data.result.apk_url) {
        await ctx.replyWithDocument({ url: data.result.apk_url }, {
          caption: `📲 *APK Download*\nApp: ${q}`,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else {
        await ctx.replyWithPhoto(BANNER, {
          caption: "❌ No APK found.",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      }
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ APK API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};