const os = require("os");
module.exports = (bot, { BANNER, CHANNEL_BUTTONS }) => {
  bot.hears(/^\.ping$/i, async ctx => {
    const start = Date.now();
    await ctx.replyWithPhoto(BANNER, {
      caption: "🏓 Pinging...",
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
    const latency = Date.now() - start;
    await ctx.replyWithPhoto(BANNER, {
      caption: `🏓 Pong! Response: ${latency} ms\nCPU: ${os.cpus()[0].model}`,
      reply_markup: { inline_keyboard: CHANNEL_BUTTONS }
    });
  });
};