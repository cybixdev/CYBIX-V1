module.exports = function(bot, config) {
  bot.command('setbotname', async ctx => {
    const ownerId = process.env.OWNER_ID;
    if (String(ctx.from.id) !== String(ownerId)) return ctx.reply('Only the owner can change the bot name.');
    const args = ctx.message.text.split(' ').slice(1);
    if (!args.length) return ctx.reply('Usage: setbotname <newBotName>');
    await config.setBotName(args.join(' '));
    await ctx.reply(`Bot name updated to: ${args.join(' ')}`);
  });
};