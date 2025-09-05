module.exports = function(bot, config) {
  bot.command('setprefix', async ctx => {
    const ownerId = process.env.OWNER_ID;
    if (String(ctx.from.id) !== String(ownerId)) return ctx.reply('Only the owner can change the prefix.');
    const args = ctx.message.text.split(' ').slice(1);
    if (!args.length) return ctx.reply('Usage: setprefix <newPrefix1> <newPrefix2> ...');
    await config.setPrefix(args);
    await ctx.reply(`Prefix updated to: ${args.join(', ')}`);
  });
};