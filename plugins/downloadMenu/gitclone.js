const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.gitclone|\/gitclone)\s+(.+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    if (!/^https?:\/\/github\.com\//.test(q)) {
      await sendBanner(ctx, '❗ Usage: .gitclone <github repo url>');
      return;
    }
    try {
      const res = await axios.get(`https://api.princetechn.com/api/download/gitclone?apikey=prince&url=${encodeURIComponent(q)}`);
      if (res.data && res.data.url) {
        await ctx.replyWithDocument({ url: res.data.url }, { caption: `📁 Repo cloned` });
      } else {
        await sendBanner(ctx, '🚫 No repo found.');
      }
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch repo.');
    }
  });
};