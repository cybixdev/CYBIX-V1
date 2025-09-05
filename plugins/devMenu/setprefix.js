module.exports = {
  command: 'setprefix',
  handler: async (ctx, sendBanner) => {
    const isOwner = (`${ctx.from.id}` === process.env.OWNER_ID);
    if (!isOwner) return sendBanner(ctx, 'Owner only command.');
    const args = ctx.message.text.split(' ').slice(1);
    if (!args.length) return sendBanner(ctx, 'Usage: .setprefix <newPrefix> [<morePrefixes>]');
    require('../../index').prefix = args;
    await sendBanner(ctx, `Prefix changed to: ${args.join(', ')}`);
  }
};