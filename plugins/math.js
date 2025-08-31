const axios = require('axios');
module.exports = (bot, sendBannerAndButtons) => {
  bot.command('math', async ctx => {
    const expr = ctx.message.text.replace(/\/math\s?/i, '').trim();
    if (!expr) return ctx.reply('Usage: /math <expression>');
    try {
      const { data } = await axios.get(`http://api.mathjs.org/v4/?expr=${encodeURIComponent(expr)}`);
      await sendBannerAndButtons(ctx, `🧮 Math:\n${expr} = ${data}`);
    } catch {
      await ctx.reply('❌ Failed to solve math.');
    }
  });
};