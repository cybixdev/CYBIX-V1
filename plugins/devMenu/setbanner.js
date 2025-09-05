module.exports = function(bot, config) {
  bot.command('setbanner', async ctx => {
    const ownerId = process.env.OWNER_ID;
    if (String(ctx.from.id) !== String(ownerId)) return ctx.reply('Only the owner can change the banner.');
    const args = ctx.message.text.split(' ').slice(1);
    if (!args.length) return ctx.reply('Usage: setbanner <bannerUrl>');
    await config.setBanner(args.join(' '));
    await ctx.reply('Banner updated!');
  });
};