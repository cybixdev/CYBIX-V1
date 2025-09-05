const axios = require('axios');
module.exports = {
  command: 'wallpaper',
  handler: async (ctx, sendBanner) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ') || 'nature';
    try {
      // Using Unsplash API (demo public endpoints)
      const res = await axios.get(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=YOUR_UNSPLASH_CLIENT_ID`);
      await ctx.replyWithPhoto(res.data.urls.full, {
        caption: `*Wallpaper:*\n${res.data.description || query}`,
        ...require('../../index').buttons,
        parse_mode: 'Markdown'
      });
    } catch (e) {
      await sendBanner(ctx, 'Failed to get wallpaper.');
    }
  }
};