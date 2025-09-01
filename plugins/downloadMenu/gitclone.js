const axios = require("axios");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.gitclone(?:\s+(.+))?$/i, async ctx => {
    const q = ctx.match[1];
    if (!q) {
      await ctx.replyWithPhoto(BANNER, {
        caption: "Usage: `.gitclone <github-repo-url>`",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
      return;
    }
    try {
      const url = `https://api.princetechn.com/api/download/gitclone?apikey=prince&url=${encodeURIComponent(q)}`;
      const { data } = await axios.get(url);
      if (data && data.result && data.result.download_url) {
        await ctx.replyWithDocument({ url: data.result.download_url }, {
          caption: `🗂️ *GitHub Repo Clone*\n${q}`,
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      } else {
        await ctx.replyWithPhoto(BANNER, {
          caption: "❌ No repo found.",
          reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
        });
      }
    } catch {
      await ctx.replyWithPhoto(BANNER, {
        caption: "❌ GitClone API error.",
        reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
      });
    }
  });
};