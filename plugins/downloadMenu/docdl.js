module.exports = (bot, sendBanner) => {
  bot.hears(/^(\.docdl|\/docdl)\s+(.+)/i, async (ctx) => {
    const q = ctx.match[2].trim();
    if (!/^https?:\/\//.test(q)) {
      await sendBanner(ctx, '❗ Usage: .docdl <document file url>');
      return;
    }
    try {
      await ctx.replyWithDocument({ url: q }, { caption: `📄 Downloaded document` });
    } catch (e) {
      await sendBanner(ctx, '🚫 Failed to fetch document.');
    }
  });
};