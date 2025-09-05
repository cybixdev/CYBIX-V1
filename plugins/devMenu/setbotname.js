module.exports = {
  command: 'setbotname',
  handler: async (ctx, sendBanner) => {
    const isOwner = (`${ctx.from.id}` === process.env.OWNER_ID);
    if (!isOwner) return sendBanner(ctx, 'Owner only command.');
    let name = ctx.message.text.split(' ').slice(1).join(' ');
    if (!name) return sendBanner(ctx, 'Usage: .setbotname <newName>');
    require('../../index').botName = name;
    await sendBanner(ctx, `Bot name changed to: ${name}`);
  }
};