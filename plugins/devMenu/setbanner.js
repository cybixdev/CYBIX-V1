module.exports = {
  command: 'setbanner',
  handler: async (ctx, sendBanner) => {
    const isOwner = (`${ctx.from.id}` === process.env.OWNER_ID);
    if (!isOwner) return sendBanner(ctx, 'Owner only command.');
    let url = ctx.message.text.split(' ').slice(1).join(' ');
    if (!url) return sendBanner(ctx, 'Usage: .setbanner <image_url>');
    require('../../index').bannerUrl = url;
    await sendBanner(ctx, `Banner changed to: ${url}`);
  }
};