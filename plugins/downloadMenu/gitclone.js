const axios = require('axios');
module.exports = (bot, sendBanner) => {
  bot.command('gitclone', async (ctx) => {
    const q = ctx.message.text.replace(/^\.gitclone\s*/, '').trim();
    if (!q || !/^https?:\/\/github\.com\//.test(q)) {
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